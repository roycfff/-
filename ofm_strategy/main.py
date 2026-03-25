#!/usr/bin/env python3
# ============================================================
#  main.py — Entry Point
#  OFM / SMC Algorithmic Trading Strategy
#  DAVIDI INTELLIGENCE | Roy Davidi
# ============================================================

import argparse
import sys

from config.settings import SYMBOL_MAP


def parse_args():
    parser = argparse.ArgumentParser(
        description="OFM/SMC Strategy | DAVIDI INTELLIGENCE",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py --mode backtest --symbol EURUSD
  python main.py --mode backtest --symbol XAUUSD
  python main.py --mode backtest --all
  python main.py --mode check
        """,
    )
    parser.add_argument(
        "--mode",
        choices=["backtest", "check"],
        default="backtest",
        help="Run mode (default: backtest)",
    )
    parser.add_argument(
        "--symbol",
        type=str,
        default="EURUSD",
        help=f"Symbol to trade. Available: {', '.join(SYMBOL_MAP.keys())}",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Run backtest on all configured symbols",
    )
    return parser.parse_args()


def mode_check():
    """Verify all modules import correctly."""
    print("Checking imports...")
    try:
        from config.settings import RISK_PER_TRADE_PCT, INITIAL_CAPITAL
        from core.structure import detect_bos, detect_swing_points, get_market_bias
        from core.zones import detect_order_blocks, detect_fvg, detect_liquidity_grab
        from core.risk_manager import RiskManager
        from core.signal_engine import SignalEngine
        print("All modules loaded successfully!")
        print(f"  Risk per trade : {RISK_PER_TRADE_PCT}%")
        print(f"  Initial capital: ${INITIAL_CAPITAL:,}")
    except ImportError as e:
        print(f"Import error: {e}")
        print("\nMake sure:")
        print("  1. Virtual environment is activated")
        print("  2. You are running from inside ofm_strategy/")
        print("  3. pip install -r requirements.txt was run")
        sys.exit(1)


def mode_backtest(symbol: str, run_all: bool):
    from backtest import run_backtest, run_all as _run_all
    if run_all:
        _run_all()
    else:
        run_backtest(symbol.upper())


def main():
    print("=" * 50)
    print("  OFM/SMC Strategy | DAVIDI INTELLIGENCE")
    print("  Roy Davidi — Python Algorithmic Trading")
    print("=" * 50)

    args = parse_args()

    if args.mode == "check":
        mode_check()
    elif args.mode == "backtest":
        mode_backtest(args.symbol, args.all)


if __name__ == "__main__":
    main()
