# ============================================================
#  OFM / SMC Strategy — Configuration
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

# ── Symbols ──────────────────────────────────────────────────
SYMBOLS = ["EURUSD=X", "XAUUSD=X", "GBPUSD=X"]

SYMBOL_MAP = {
    "EURUSD": "EURUSD=X",
    "XAUUSD": "XAUUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    "BTCUSD": "BTC-USD",
}

# ── Risk Management ──────────────────────────────────────────
RISK_PER_TRADE_PCT = 1.0      # % of account per trade (FTMO: keep ≤ 1%)
MAX_TRADES_PER_DAY = 3        # Hard cap on daily trades
MAX_DAILY_LOSS_PCT = 4.0      # Stop trading if daily loss exceeds this %
MAX_DRAWDOWN_PCT   = 8.0      # Total drawdown limit before halting

# ── Trade Parameters ─────────────────────────────────────────
SL_BUFFER_PCT  = 0.10         # 10% buffer below/above OB for Stop Loss
TP1_R          = 1.5          # Advance SL to break-even at this R multiple
FINAL_TP_R     = 3.0          # Final Take-Profit target in R multiples
TRAIL_AFTER_R  = 2.0          # Start trailing stop after this R multiple

# ── Session Filter (UTC hours) ───────────────────────────────
# 01:00–04:00 UTC = 03:00–06:00 Israel time (pre-London)
SESSION_START_UTC = 1
SESSION_END_UTC   = 4

# Optionally also trade London open
LONDON_START_UTC  = 7
LONDON_END_UTC    = 11

USE_LONDON_SESSION = False    # Set True to include London session

# ── Structure Detection ──────────────────────────────────────
SWING_LOOKBACK  = 10          # Candles each side to confirm a swing point
BOS_CONFIRMATION = True       # Require candle close beyond swing for BOS
CHOCH_LOOKBACK  = 3           # BOS candles to look back for CHOCH detection

# ── Zone Detection ───────────────────────────────────────────
OB_LOOKBACK     = 50          # Candles to scan for Order Blocks
FVG_MIN_SIZE    = 0.0002      # Minimum gap size to qualify as FVG (in price)
LIQ_GRAB_WICK   = 0.6         # Wick-to-body ratio to flag Liquidity Grab

# ── Timeframes ───────────────────────────────────────────────
BIAS_TF   = "1d"              # Daily — directional bias
H4_TF     = "1h"              # 4H equivalent (yfinance uses 1h for H4 proxy)
SIGNAL_TF = "1h"              # H1 — BOS/CHOCH detection
ENTRY_TF  = "15m"             # M15 — entry / retest zone

# ── Backtest ─────────────────────────────────────────────────
INITIAL_CAPITAL = 100_000     # Starting capital (match your FTMO account)
BACKTEST_PERIOD = "2y"        # yfinance period: 1y / 2y / 5y
COMMISSION_PCT  = 0.0         # Broker commission per trade (0 for CFDs/forex)
SLIPPAGE_PCT    = 0.0001      # Estimated slippage per trade

# ── Misc ─────────────────────────────────────────────────────
VERBOSE = True                # Print detailed logs during backtest
