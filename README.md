## Regime-Switching HMM Trading Engine

A full-stack, regime-aware market analysis app that detects market regimes with a Hidden Markov Model (HMM), produces trading signals, and visualizes backtests in a Next.js dashboard. The backend is built with FastAPI and deployed to AWS Lambda behind API Gateway.

## Highlights

- Regime detection with a 3-state Gaussian HMM (bull, bear, sideways)
- Signal generation that blends regime probabilities with technical signals
- Backtesting engine with benchmark comparison and metrics
- Production-ready AWS Lambda deployment (container or ZIP)
- Interactive Next.js dashboard for regimes, signals, and backtest charts

## Architecture Overview

```
Frontend (Next.js) → FastAPI API → Data + Model Pipeline
                                   ├── yfinance (OHLCV)
                                   ├── HMM regime detection
                                   ├── Signal generation
                                   └── Backtest engine
```

## HMM Logic (How Regimes Are Inferred)

The model treats market regimes as hidden states and learns them from return dynamics:

1. **Input data**: Daily OHLCV from `yfinance`, cached to a local parquet file.
2. **Feature**: Log returns of the close price.
3. **Model**: `GaussianHMM` with 3 hidden states, fit on returns.
4. **Inference**: The model outputs state probabilities for the latest window.
5. **Interpretation**: The three states are mapped to **bull**, **bear**, and **sideways** regimes for downstream logic.

If data is insufficient or the model cannot fit, the backend safely returns uniform regime probabilities.

## Signal Generation Logic

Signals combine regime probabilities with lightweight technical indicators:

- **Bull regime**: Moving-average crossover (50/200).
- **Bear regime**: RSI mean-reversion (buy if oversold, sell if overbought).
- **Sideways regime**: Neutral (hold).

Final action is the **weighted sum** of these signals using the regime probabilities, producing `BUY`, `SELL`, or `HOLD` with confidence.

## End-to-End Process

1. Fetch and cache OHLCV data (`/tmp` in Lambda, local file in dev).
2. Fit HMM on historical returns.
3. Predict current regime probabilities.
4. Generate a weighted trading signal.
5. Run rolling-window backtests and compute metrics.
6. Serve results to the Next.js dashboard.

## Frontend Experience

The Next.js UI provides:

- Real-time regime probability cards
- Latest trading signal with confidence and weighted score
- Backtest metrics and cumulative return charts
- API tester for quick endpoint validation

Set the API URL via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

## API Endpoints

- `GET /health` — Health check
- `GET /regime/latest` — Latest regime probabilities
- `GET /signal/latest` — Latest trading signal
- `GET /backtest?years=10` — Backtest metrics and series

## AWS Deployment (Lambda + API Gateway)

The backend is optimized for AWS Lambda with a Mangum adapter and `/tmp` caching. Deployment guides:

- `backend/DEPLOYMENT.md` — Full walkthrough (SAM + Docker + ZIP)
- `backend/LAMBDA_SETUP.md` — Quick reference

### Key Lambda Settings

- Runtime: Python 3.11
- Memory: 2048 MB+ (3008 MB recommended for backtest)
- Timeout: 600 seconds
- Handler: `lambda_handler.handler`

### Required Environment Variables

```
SYMBOL=SPY
ALLOWED_ORIGINS=https://yourdomain.com
CACHE_PATH=/tmp/data_cache.parquet
```

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
# Optional:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Recharts
- **Backend**: FastAPI, Python, Mangum
- **ML/Quant**: hmmlearn, pandas, numpy, yfinance
- **Infra**: AWS Lambda, API Gateway, SAM/Docker

## Notes

This project is for educational and research purposes and is not financial advice.
