# ============================================================
#  core/structure.py
#  BOS, CHOCH, Swing Points detection
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

import pandas as pd
import numpy as np
from config.settings import SWING_LOOKBACK, BOS_CONFIRMATION, CHOCH_LOOKBACK


def detect_swing_points(df: pd.DataFrame, lookback: int = SWING_LOOKBACK) -> pd.DataFrame:
    """
    Mark swing highs and swing lows.
    A swing high: highest high in [i-lookback : i+lookback]
    A swing low:  lowest low  in [i-lookback : i+lookback]

    Adds columns:
        swing_high (bool), swing_low (bool)
    """
    highs = df["High"].values
    lows  = df["Low"].values
    n     = len(df)

    swing_high = np.zeros(n, dtype=bool)
    swing_low  = np.zeros(n, dtype=bool)

    for i in range(lookback, n - lookback):
        window_highs = highs[i - lookback : i + lookback + 1]
        window_lows  = lows[i - lookback  : i + lookback + 1]

        if highs[i] == window_highs.max():
            swing_high[i] = True
        if lows[i] == window_lows.min():
            swing_low[i] = True

    df = df.copy()
    df["swing_high"] = swing_high
    df["swing_low"]  = swing_low
    return df


def detect_bos(df: pd.DataFrame) -> pd.DataFrame:
    """
    Break of Structure (BOS):
    - Bullish BOS: close breaks above the most recent confirmed swing high
    - Bearish BOS: close breaks below the most recent confirmed swing low

    Requires swing_high / swing_low columns (run detect_swing_points first).

    Adds columns:
        bos_bull (bool), bos_bear (bool)
    """
    df = df.copy()
    n  = len(df)
    bos_bull = np.zeros(n, dtype=bool)
    bos_bear = np.zeros(n, dtype=bool)

    last_sh = None   # last swing high price
    last_sl = None   # last swing low price

    for i in range(n):
        # Record swing points as we move forward
        if df["swing_high"].iloc[i]:
            last_sh = df["High"].iloc[i]
        if df["swing_low"].iloc[i]:
            last_sl = df["Low"].iloc[i]

        close = df["Close"].iloc[i]

        if BOS_CONFIRMATION:
            # Require candle close beyond the swing
            if last_sh is not None and close > last_sh:
                bos_bull[i] = True
                last_sh = None   # reset so we don't double-count
            if last_sl is not None and close < last_sl:
                bos_bear[i] = True
                last_sl = None
        else:
            if last_sh is not None and df["High"].iloc[i] > last_sh:
                bos_bull[i] = True
                last_sh = None
            if last_sl is not None and df["Low"].iloc[i] < last_sl:
                bos_bear[i] = True
                last_sl = None

    df["bos_bull"] = bos_bull
    df["bos_bear"] = bos_bear
    return df


def detect_choch(df: pd.DataFrame) -> pd.DataFrame:
    """
    Change of Character (CHOCH):
    A CHOCH occurs when price breaks structure in the OPPOSITE direction
    shortly after a BOS — signalling a potential trend reversal.

    Requires bos_bull / bos_bear columns (run detect_bos first).

    Adds columns:
        choch_bull (bool) — bullish reversal signal
        choch_bear (bool) — bearish reversal signal
    """
    df = df.copy()
    n  = len(df)
    choch_bull = np.zeros(n, dtype=bool)
    choch_bear = np.zeros(n, dtype=bool)

    for i in range(CHOCH_LOOKBACK, n):
        window = df.iloc[i - CHOCH_LOOKBACK : i]

        # If recent bearish BOS followed by bullish close → CHOCH bull
        if window["bos_bear"].any():
            if df["Close"].iloc[i] > df["High"].iloc[i - CHOCH_LOOKBACK : i].max():
                choch_bull[i] = True

        # If recent bullish BOS followed by bearish close → CHOCH bear
        if window["bos_bull"].any():
            if df["Close"].iloc[i] < df["Low"].iloc[i - CHOCH_LOOKBACK : i].min():
                choch_bear[i] = True

    df["choch_bull"] = choch_bull
    df["choch_bear"] = choch_bear
    return df


def get_market_bias(df_daily: pd.DataFrame) -> str:
    """
    Determine overall directional bias from the daily timeframe.

    Returns:
        'bull'  — bullish bias
        'bear'  — bearish bias
        'neutral' — no clear bias
    """
    df = detect_swing_points(df_daily)
    df = detect_bos(df)

    recent = df.tail(20)
    bull_count = recent["bos_bull"].sum()
    bear_count = recent["bos_bear"].sum()

    if bull_count > bear_count:
        return "bull"
    elif bear_count > bull_count:
        return "bear"
    return "neutral"
