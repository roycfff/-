# ============================================================
#  backtest.py
#  Historical Backtest Runner
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime

from config.settings import (
    SYMBOL_MAP,
    INITIAL_CAPITAL,
    BACKTEST_PERIOD,
    VERBOSE,
)
from core.signal_engine import SignalEngine, Signal
from core.risk_manager import RiskManager, Trade


# ── Data Loading ─────────────────────────────────────────────

def load_data(symbol: str, period: str = BACKTEST_PERIOD) -> dict[str, pd.DataFrame]:
    """
    Download OHLCV data for multiple timeframes.
    Returns dict with keys: 'daily', 'h1', 'm15'
    """
    ticker = SYMBOL_MAP.get(symbol, symbol)

    print(f"Downloading {symbol} ({ticker}) data...")

    daily = yf.download(ticker, period=period, interval="1d",  auto_adjust=True, progress=False)
    h1    = yf.download(ticker, period="730d",  interval="1h",  auto_adjust=True, progress=False)
    m15   = yf.download(ticker, period="60d",   interval="15m", auto_adjust=True, progress=False)

    # Flatten MultiIndex columns if present
    for df in [daily, h1, m15]:
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

    # Drop empty
    daily.dropna(inplace=True)
    h1.dropna(inplace=True)
    m15.dropna(inplace=True)

    print(f"  Daily:  {len(daily)} candles | {daily.index[0].date()} → {daily.index[-1].date()}")
    print(f"  H1:     {len(h1)} candles")
    print(f"  M15:    {len(m15)} candles")

    return {"daily": daily, "h1": h1, "m15": m15}


# ── Backtest Core ─────────────────────────────────────────────

def run_backtest(symbol: str = "EURUSD") -> dict:
    print(f"\n{'='*50}")
    print(f"  Backtest | {symbol}")
    print(f"{'='*50}")

    data = load_data(symbol)
    if data["m15"].empty or data["h1"].empty:
        print(f"No data found for {symbol}. Check symbol name or internet connection.")
        return {}

    risk_manager = RiskManager(account_balance=INITIAL_CAPITAL)

    engine = SignalEngine(
        df_daily = data["daily"],
        df_h1    = data["h1"],
        df_m15   = data["m15"],
        symbol   = symbol,
    )

    print("\nScanning for signals...")
    signals = engine.scan()
    print(f"Signals found: {len(signals)}")

    if not signals:
        print("No signals generated. Adjust settings (session hours, swing lookback).")
        return {}

    # Simulate trades on M15 price data
    m15 = data["m15"]
    current_day = None

    for signal in signals:
        # Reset daily counters
        sig_day = signal.timestamp.date()
        if sig_day != current_day:
            risk_manager.reset_daily()
            current_day = sig_day

        # Check if we can take the trade
        ok, reason = risk_manager.can_trade()
        if not ok:
            if VERBOSE:
                print(f"  [{signal.timestamp}] Skipped: {reason}")
            continue

        # Size the trade
        size, risk_amt = risk_manager.calculate_position_size(
            entry_price = signal.entry_price,
            stop_loss   = signal.stop_loss,
        )

        if size == 0:
            continue

        trade = Trade(
            symbol        = signal.symbol,
            direction     = signal.direction,
            entry_price   = signal.entry_price,
            stop_loss     = signal.stop_loss,
            take_profit   = signal.take_profit,
            position_size = size,
            risk_amount   = risk_amt,
            entry_time    = signal.timestamp,
        )
        risk_manager.open_trade(trade)

        if VERBOSE:
            print(
                f"  OPEN  {signal.direction.upper():5s} {signal.symbol} "
                f"@ {signal.entry_price:.5f} | "
                f"SL {signal.stop_loss:.5f} | "
                f"TP {signal.take_profit:.5f} | "
                f"R:R {signal.r_ratio:.1f} | "
                f"Bias:{signal.bias} {signal.bos_type}/{signal.zone_type}"
            )

        # Walk forward through M15 candles from entry to simulate outcome
        future = m15[m15.index > signal.timestamp].head(200)
        for ts, row in future.iterrows():
            closed = risk_manager.update_trades(row["Close"], ts)
            for t in closed:
                outcome = "WIN" if t.pnl > 0 else "LOSS"
                if VERBOSE:
                    print(
                        f"  CLOSE {outcome:4s} {t.direction.upper():5s} "
                        f"@ {t.exit_price:.5f} | "
                        f"P&L: ${t.pnl:+.2f} | R: {t.r_multiple:.2f}"
                    )
            if not risk_manager.open_trades:
                break

    # Close any remaining open trades at last price
    last_price = m15["Close"].iloc[-1]
    risk_manager.update_trades(last_price, m15.index[-1])

    # ── Results ──────────────────────────────────────────────
    stats = risk_manager.get_stats()

    if not stats:
        print("No completed trades.")
        return {}

    print(f"\n{'='*50}")
    print(f"  Backtest Results — {symbol}")
    print(f"{'='*50}")
    print(f"  Signals generated : {len(signals)}")
    print(f"  Total trades      : {stats['total_trades']}")
    print(f"  Wins / Losses     : {stats['wins']} / {stats['losses']}")
    print(f"  Win Rate          : {stats['win_rate']:.1f}%")
    print(f"  Profit Factor     : {stats['profit_factor']:.2f}")
    print(f"  Avg R             : {stats['avg_r']:.2f}")
    print(f"  Net P&L           : ${stats['net_pnl']:+,.2f}")
    print(f"  Final Balance     : ${stats['final_balance']:,.2f}")
    print(f"  Max Drawdown      : {stats['max_drawdown']:.2f}%")
    print(f"{'='*50}\n")

    return stats


# ── Multi-Symbol ─────────────────────────────────────────────

def run_all(symbols: list[str] = None) -> dict[str, dict]:
    from config.settings import SYMBOLS
    syms   = symbols or [s.replace("=X", "").replace("-USD", "USD") for s in SYMBOLS]
    results = {}
    for sym in syms:
        results[sym] = run_backtest(sym)
    return results


if __name__ == "__main__":
    run_backtest("EURUSD")
