# ============================================================
#  core/signal_engine.py
#  Central Signal Logic — all 4 conditions must be met
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================
#
#  Signal waterfall:
#   1. D1 + H4  → Directional Bias   (bull / bear)
#   2. H1       → BOS / CHOCH        (structural shift)
#   3. M15      → Retest Zone         (OB or FVG touch)
#   4. All match → SIGNAL generated
#
# ============================================================

from dataclasses import dataclass, field
from typing import Optional
import pandas as pd

from config.settings import (
    SESSION_START_UTC,
    SESSION_END_UTC,
    LONDON_START_UTC,
    LONDON_END_UTC,
    USE_LONDON_SESSION,
    FINAL_TP_R,
    SL_BUFFER_PCT,
)
from core.structure import get_market_bias, detect_swing_points, detect_bos, detect_choch
from core.zones import detect_order_blocks, detect_fvg, detect_liquidity_grab, get_active_zones
from core.risk_manager import RiskManager, Trade


@dataclass
class Signal:
    symbol: str
    direction: str          # 'long' | 'short'
    entry_price: float
    stop_loss: float
    take_profit: float
    timestamp: pd.Timestamp
    bias: str
    bos_type: str           # 'bos' | 'choch'
    zone_type: str          # 'order_block' | 'fvg'
    r_ratio: float = 0.0

    def __post_init__(self):
        sl_dist = abs(self.entry_price - self.stop_loss)
        tp_dist = abs(self.take_profit - self.entry_price)
        self.r_ratio = round(tp_dist / sl_dist, 2) if sl_dist > 0 else 0.0


class SignalEngine:
    def __init__(
        self,
        df_daily: pd.DataFrame,
        df_h1:    pd.DataFrame,
        df_m15:   pd.DataFrame,
        symbol:   str = "EURUSD",
    ):
        self.symbol   = symbol
        self.df_daily = df_daily
        self.df_h1    = df_h1
        self.df_m15   = df_m15
        self.signals: list[Signal] = []

    # ── Condition 1: Bias ────────────────────────────────────

    def _get_bias(self) -> str:
        return get_market_bias(self.df_daily)

    # ── Condition 2: BOS / CHOCH ─────────────────────────────

    def _get_structure_signals(self) -> pd.DataFrame:
        df = detect_swing_points(self.df_h1)
        df = detect_bos(df)
        df = detect_choch(df)
        return df

    # ── Condition 3: Session Filter ──────────────────────────

    @staticmethod
    def _in_session(ts: pd.Timestamp) -> bool:
        hour = ts.hour
        in_primary = SESSION_START_UTC <= hour < SESSION_END_UTC
        in_london  = LONDON_START_UTC  <= hour < LONDON_END_UTC
        if USE_LONDON_SESSION:
            return in_primary or in_london
        return in_primary

    # ── Condition 4: Retest Zone ─────────────────────────────

    def _find_entry_zone(self, direction: str, current_price: float) -> Optional[dict]:
        obs  = detect_order_blocks(self.df_m15)
        fvgs = detect_fvg(self.df_m15)
        zones = get_active_zones(obs, fvgs, current_price, direction)

        if zones["order_blocks"]:
            ob = zones["order_blocks"][-1]
            return {
                "type"   : "order_block",
                "top"    : ob.top,
                "bottom" : ob.bottom,
            }
        if zones["fvgs"]:
            fvg = zones["fvgs"][-1]
            return {
                "type"   : "fvg",
                "top"    : fvg.top,
                "bottom" : fvg.bottom,
            }
        return None

    # ── Main Scan ────────────────────────────────────────────

    def scan(self) -> list[Signal]:
        """
        Run full signal scan across the M15 data.
        Returns a list of Signal objects.
        """
        self.signals = []

        # Step 1: Bias
        bias = self._get_bias()
        if bias == "neutral":
            return []

        # Step 2: Structure (H1)
        h1_struct = self._get_structure_signals()

        # Step 3: Scan each M15 candle
        obs  = detect_order_blocks(self.df_m15)
        fvgs = detect_fvg(self.df_m15)
        self.df_m15 = detect_liquidity_grab(self.df_m15)

        for i in range(20, len(self.df_m15)):
            ts    = self.df_m15.index[i]
            price = self.df_m15["Close"].iloc[i]

            # Session filter
            if not self._in_session(ts):
                continue

            # Find matching H1 BOS/CHOCH within the last 8 hours
            h1_window = h1_struct[h1_struct.index <= ts].tail(8)

            if bias == "bull":
                has_structure = (
                    h1_window["bos_bull"].any() or
                    h1_window["choch_bull"].any()
                )
                bos_type  = "choch" if h1_window["choch_bull"].any() else "bos"
                direction = "long"
            else:
                has_structure = (
                    h1_window["bos_bear"].any() or
                    h1_window["choch_bear"].any()
                )
                bos_type  = "choch" if h1_window["choch_bear"].any() else "bos"
                direction = "short"

            if not has_structure:
                continue

            # Zone check
            zone = self._find_entry_zone(direction, price)
            if zone is None:
                continue

            # Build SL / TP
            buffer = (zone["top"] - zone["bottom"]) * SL_BUFFER_PCT
            if direction == "long":
                sl = zone["bottom"] - buffer
                tp = price + abs(price - sl) * FINAL_TP_R
            else:
                sl = zone["top"] + buffer
                tp = price - abs(sl - price) * FINAL_TP_R

            signal = Signal(
                symbol      = self.symbol,
                direction   = direction,
                entry_price = price,
                stop_loss   = sl,
                take_profit = tp,
                timestamp   = ts,
                bias        = bias,
                bos_type    = bos_type,
                zone_type   = zone["type"],
            )
            self.signals.append(signal)

        return self.signals
