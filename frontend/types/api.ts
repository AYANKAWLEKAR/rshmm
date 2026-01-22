export interface RegimeResponse {
  bull_probability: number
  bear_probability: number
  sideways_probability: number
  timestamp: string
}

export interface SignalResponse {
  action: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  regime_probs: number[]
  weighted_signal: number
  timestamp: string
}

export interface BacktestResponse {
  strategy_metrics: {
    annualized_return: number
    sharpe_ratio: number
    max_drawdown: number
    volatility: number
  }
  benchmark_metrics: {
    annualized_return: number
    sharpe_ratio: number
    max_drawdown: number
    volatility: number
  }
  strategy_cumulative: number[]
  benchmark_cumulative: number[]
  dates: string[]
}

export interface HealthResponse {
  status: string
}
