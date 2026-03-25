# ============================================================
#  core/zones.py
#  Order Blocks, Fair Value Gaps (FVG), Liquidity Grabs
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

import pandas as pd
import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional
from config.settings import OB_LOOKBACK, FVG_MIN_SIZE, LIQ_GRAB_WICK


@dataclass
class OrderBlock:
    index: int
    direction: str          # 'bull' | 'bear'
    top: float
    bottom: float
    timestamp: pd.Timestamp
    mitigated: bool = False

    @property
    def midpoint(self) -> float:
        return (self.top + self.bottom) / 2

    def contains(self, price: float) -> bool:
        return self.bottom <= price <= self.top


@dataclass
class FVG:
    index: int
    direction: str          # 'bull' | 'bear'
    top: float
    bottom: float
    timestamp: pd.Timestamp
    filled: bool = False

    def contains(self, price: float) -> bool:
        return self.bottom <= price <= self.top


def detect_order_blocks(df: pd.DataFrame, lookback: int = OB_LOOKBACK) -> List[OrderBlock]:
    """
    Order Block: the last bearish candle before a bullish impulse (bull OB)
                 or the last bullish candle before a bearish impulse (bear OB).

    A 'strong move' is defined as 3+ consecutive candles in one direction.
    """
    obs: List[OrderBlock] = []
    n   = len(df)
    start = max(0, n - lookback)

    for i in range(start + 2, n - 1):
        # --- Bullish OB ---
        # Look for: bearish candle at i-1 followed by strong up move
        prev_bearish = df["Close"].iloc[i - 1] < df["Open"].iloc[i - 1]
        strong_up    = (
            df["Close"].iloc[i] > df["Open"].iloc[i] and
            df["Close"].iloc[i] > df["High"].iloc[i - 1]
        )
        if prev_bearish and strong_up:
            ob = OrderBlock(
                index     = i - 1,
                direction = "bull",
                top       = max(df["Open"].iloc[i - 1], df["Close"].iloc[i - 1]),
                bottom    = min(df["Open"].iloc[i - 1], df["Close"].iloc[i - 1]),
                timestamp = df.index[i - 1],
            )
            obs.append(ob)

        # --- Bearish OB ---
        # Look for: bullish candle at i-1 followed by strong down move
        prev_bullish = df["Close"].iloc[i - 1] > df["Open"].iloc[i - 1]
        strong_down  = (
            df["Close"].iloc[i] < df["Open"].iloc[i] and
            df["Close"].iloc[i] < df["Low"].iloc[i - 1]
        )
        if prev_bullish and strong_down:
            ob = OrderBlock(
                index     = i - 1,
                direction = "bear",
                top       = max(df["Open"].iloc[i - 1], df["Close"].iloc[i - 1]),
                bottom    = min(df["Open"].iloc[i - 1], df["Close"].iloc[i - 1]),
                timestamp = df.index[i - 1],
            )
            obs.append(ob)

    return obs


def detect_fvg(df: pd.DataFrame) -> List[FVG]:
    """
    Fair Value Gap (FVG / Imbalance):
    - Bullish FVG: candle[i].low > candle[i-2].high  → gap between i-2 and i
    - Bearish FVG: candle[i].high < candle[i-2].low

    Minimum gap size controlled by FVG_MIN_SIZE.
    """
    fvgs: List[FVG] = []
    n = len(df)

    for i in range(2, n):
        # Bullish FVG
        gap_bottom = df["High"].iloc[i - 2]
        gap_top    = df["Low"].iloc[i]
        if gap_top > gap_bottom and (gap_top - gap_bottom) >= FVG_MIN_SIZE:
            fvgs.append(FVG(
                index     = i,
                direction = "bull",
                top       = gap_top,
                bottom    = gap_bottom,
                timestamp = df.index[i],
            ))

        # Bearish FVG
        gap_top2    = df["Low"].iloc[i - 2]
        gap_bottom2 = df["High"].iloc[i]
        if gap_top2 > gap_bottom2 and (gap_top2 - gap_bottom2) >= FVG_MIN_SIZE:
            fvgs.append(FVG(
                index     = i,
                direction = "bear",
                top       = gap_top2,
                bottom    = gap_bottom2,
                timestamp = df.index[i],
            ))

    return fvgs


def detect_liquidity_grab(df: pd.DataFrame) -> pd.DataFrame:
    """
    Liquidity Grab: a candle with a long wick that sweeps a prior swing level
    but closes back inside the range — indicating stop-hunt / liquidity sweep.

    Flags:
        liq_grab_bull: wick below swept a low then closed above it
        liq_grab_bear: wick above swept a high then closed below it
    """
    df = df.copy()
    n  = len(df)
    liq_bull = np.zeros(n, dtype=bool)
    liq_bear = np.zeros(n, dtype=bool)

    for i in range(1, n):
        body      = abs(df["Close"].iloc[i] - df["Open"].iloc[i])
        if body == 0:
            continue

        lower_wick = min(df["Open"].iloc[i], df["Close"].iloc[i]) - df["Low"].iloc[i]
        upper_wick = df["High"].iloc[i] - max(df["Open"].iloc[i], df["Close"].iloc[i])

        # Lower wick grabs liquidity below prior low, closes back up
        if lower_wick / body >= LIQ_GRAB_WICK:
            if df["Low"].iloc[i] < df["Low"].iloc[i - 1]:
                if df["Close"].iloc[i] > df["Low"].iloc[i - 1]:
                    liq_bull[i] = True

        # Upper wick grabs liquidity above prior high, closes back down
        if upper_wick / body >= LIQ_GRAB_WICK:
            if df["High"].iloc[i] > df["High"].iloc[i - 1]:
                if df["Close"].iloc[i] < df["High"].iloc[i - 1]:
                    liq_bear[i] = True

    df["liq_grab_bull"] = liq_bull
    df["liq_grab_bear"] = liq_bear
    return df


def get_active_zones(
    obs: List[OrderBlock],
    fvgs: List[FVG],
    current_price: float,
    direction: str,
    proximity_pct: float = 0.003,
) -> dict:
    """
    Return OBs and FVGs in the given direction that price is currently
    near (within proximity_pct of the zone).
    """
    active_obs  = []
    active_fvgs = []

    for ob in obs:
        if ob.direction == direction and not ob.mitigated:
            dist = abs(current_price - ob.midpoint) / current_price
            if dist <= proximity_pct or ob.contains(current_price):
                active_obs.append(ob)

    for fvg in fvgs:
        if fvg.direction == direction and not fvg.filled:
            dist = abs(current_price - (fvg.top + fvg.bottom) / 2) / current_price
            if dist <= proximity_pct or fvg.contains(current_price):
                active_fvgs.append(fvg)

    return {"order_blocks": active_obs, "fvgs": active_fvgs}
