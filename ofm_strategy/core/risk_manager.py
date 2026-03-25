# ============================================================
#  core/risk_manager.py
#  Position Sizing, Trailing Stop, Daily Loss Guard
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

from dataclasses import dataclass, field
from typing import Optional
from config.settings import (
    RISK_PER_TRADE_PCT,
    MAX_TRADES_PER_DAY,
    MAX_DAILY_LOSS_PCT,
    MAX_DRAWDOWN_PCT,
    TP1_R,
    FINAL_TP_R,
    TRAIL_AFTER_R,
    SL_BUFFER_PCT,
)


@dataclass
class Trade:
    symbol: str
    direction: str          # 'long' | 'short'
    entry_price: float
    stop_loss: float
    take_profit: float
    position_size: float    # units / lots
    risk_amount: float      # $ at risk
    r_multiple: float = 0.0
    pnl: float = 0.0
    status: str = "open"    # open | closed | breakeven
    trailing_sl: Optional[float] = None
    entry_time: Optional[object] = None
    exit_time:  Optional[object] = None
    exit_price: Optional[float]  = None

    @property
    def risk_reward(self) -> float:
        """Planned R:R ratio."""
        sl_dist = abs(self.entry_price - self.stop_loss)
        tp_dist = abs(self.take_profit - self.entry_price)
        return tp_dist / sl_dist if sl_dist > 0 else 0.0

    def current_r(self, current_price: float) -> float:
        """Current R multiple at given price."""
        sl_dist = abs(self.entry_price - self.stop_loss)
        if sl_dist == 0:
            return 0.0
        if self.direction == "long":
            return (current_price - self.entry_price) / sl_dist
        else:
            return (self.entry_price - current_price) / sl_dist


class RiskManager:
    def __init__(self, account_balance: float):
        self.initial_balance = account_balance
        self.balance         = account_balance
        self.peak_balance    = account_balance
        self.daily_loss      = 0.0
        self.trades_today    = 0
        self.open_trades: list[Trade] = []
        self.closed_trades: list[Trade] = []

    # ── Guards ────────────────────────────────────────────────

    def can_trade(self) -> tuple[bool, str]:
        """Check all guards before allowing a new trade."""
        if self.trades_today >= MAX_TRADES_PER_DAY:
            return False, f"Max trades/day reached ({MAX_TRADES_PER_DAY})"

        daily_loss_pct = (self.daily_loss / self.initial_balance) * 100
        if daily_loss_pct >= MAX_DAILY_LOSS_PCT:
            return False, f"Daily loss limit reached ({daily_loss_pct:.1f}%)"

        drawdown_pct = ((self.peak_balance - self.balance) / self.peak_balance) * 100
        if drawdown_pct >= MAX_DRAWDOWN_PCT:
            return False, f"Max drawdown reached ({drawdown_pct:.1f}%)"

        return True, "OK"

    def reset_daily(self):
        """Call at the start of each trading day."""
        self.daily_loss  = 0.0
        self.trades_today = 0

    # ── Sizing ────────────────────────────────────────────────

    def calculate_position_size(
        self,
        entry_price: float,
        stop_loss: float,
        pip_value: float = 1.0,
    ) -> tuple[float, float]:
        """
        Returns (position_size, risk_amount).

        position_size = risk_amount / (SL distance in price × pip_value)
        For simplicity in backtest, position_size is expressed in 'units'
        where 1 unit profit/loss = price move × pip_value.
        """
        risk_amount = self.balance * (RISK_PER_TRADE_PCT / 100)
        sl_distance = abs(entry_price - stop_loss)

        if sl_distance == 0:
            return 0.0, 0.0

        position_size = risk_amount / (sl_distance * pip_value)
        return round(position_size, 4), round(risk_amount, 2)

    def build_sl(
        self,
        direction: str,
        zone_top: float,
        zone_bottom: float,
    ) -> float:
        """Place SL just beyond the OB/FVG zone with buffer."""
        buffer = (zone_top - zone_bottom) * SL_BUFFER_PCT
        if direction == "long":
            return zone_bottom - buffer
        else:
            return zone_top + buffer

    def build_tp(self, entry: float, stop_loss: float, r_multiple: float = FINAL_TP_R) -> float:
        """Calculate TP at r_multiple × SL distance."""
        sl_dist = abs(entry - stop_loss)
        if entry > stop_loss:   # long
            return entry + sl_dist * r_multiple
        else:                   # short
            return entry - sl_dist * r_multiple

    # ── Trade Lifecycle ──────────────────────────────────────

    def open_trade(self, trade: Trade):
        self.open_trades.append(trade)
        self.trades_today += 1

    def update_trades(self, current_price: float, current_time=None) -> list[Trade]:
        """
        Update all open trades:
         - Advance SL to breakeven at TP1_R
         - Trail stop after TRAIL_AFTER_R
         - Close if SL or TP hit

        Returns list of trades closed this tick.
        """
        closed = []

        for trade in list(self.open_trades):
            r = trade.current_r(current_price)

            # ── Breakeven ──
            if r >= TP1_R and trade.status == "open":
                trade.stop_loss = trade.entry_price
                trade.status    = "breakeven"

            # ── Trailing Stop ──
            if r >= TRAIL_AFTER_R:
                sl_dist = abs(trade.entry_price - trade.trailing_sl or trade.stop_loss)
                if trade.direction == "long":
                    new_trail = current_price - sl_dist
                    if trade.trailing_sl is None or new_trail > trade.trailing_sl:
                        trade.trailing_sl = new_trail
                        trade.stop_loss   = new_trail
                else:
                    new_trail = current_price + sl_dist
                    if trade.trailing_sl is None or new_trail < trade.trailing_sl:
                        trade.trailing_sl = new_trail
                        trade.stop_loss   = new_trail

            # ── Check SL hit ──
            sl_hit = (
                (trade.direction == "long"  and current_price <= trade.stop_loss) or
                (trade.direction == "short" and current_price >= trade.stop_loss)
            )
            tp_hit = (
                (trade.direction == "long"  and current_price >= trade.take_profit) or
                (trade.direction == "short" and current_price <= trade.take_profit)
            )

            if sl_hit or tp_hit:
                exit_price      = trade.stop_loss if sl_hit else trade.take_profit
                trade.exit_price = exit_price
                trade.exit_time  = current_time

                sl_dist = abs(trade.entry_price - trade.stop_loss)
                if trade.direction == "long":
                    trade.pnl = (exit_price - trade.entry_price) * trade.position_size
                else:
                    trade.pnl = (trade.entry_price - exit_price) * trade.position_size

                trade.r_multiple = trade.current_r(exit_price)
                trade.status     = "closed"

                self.balance      += trade.pnl
                self.peak_balance  = max(self.peak_balance, self.balance)
                if trade.pnl < 0:
                    self.daily_loss += abs(trade.pnl)

                self.open_trades.remove(trade)
                self.closed_trades.append(trade)
                closed.append(trade)

        return closed

    # ── Metrics ──────────────────────────────────────────────

    def get_stats(self) -> dict:
        trades = self.closed_trades
        if not trades:
            return {}

        wins   = [t for t in trades if t.pnl > 0]
        losses = [t for t in trades if t.pnl <= 0]
        gross_profit = sum(t.pnl for t in wins)
        gross_loss   = abs(sum(t.pnl for t in losses))

        drawdowns = []
        peak = self.initial_balance
        running = self.initial_balance
        for t in trades:
            running += t.pnl
            peak     = max(peak, running)
            drawdowns.append((peak - running) / peak * 100)

        return {
            "total_trades":   len(trades),
            "wins":           len(wins),
            "losses":         len(losses),
            "win_rate":       len(wins) / len(trades) * 100,
            "profit_factor":  gross_profit / gross_loss if gross_loss > 0 else float("inf"),
            "net_pnl":        sum(t.pnl for t in trades),
            "final_balance":  self.initial_balance + sum(t.pnl for t in trades),
            "max_drawdown":   max(drawdowns) if drawdowns else 0.0,
            "avg_r":          sum(t.r_multiple for t in trades) / len(trades),
        }
