'use client'

import { useState, useEffect } from 'react'
import { BacktestResponse } from '@/types/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BacktestResultsProps {
  years: number
}

export default function BacktestResults({ years }: BacktestResultsProps) {
  const [data, setData] = useState<BacktestResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchBacktest()
  }, [years])

  const fetchBacktest = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/backtest?years=${years}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch backtest results' }))
        throw new Error(errorData.detail || 'Failed to fetch backtest results')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching backtest:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Backtest Results</h3>
        <p>Loading backtest results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Backtest Results</h3>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
        <button
          onClick={fetchBacktest}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Backtest Results</h3>
        <p style={{ color: '#666' }}>No backtest data available</p>
      </div>
    )
  }

  // Prepare chart data
  const chartData = data.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    strategy: data.strategy_cumulative[index],
    benchmark: data.benchmark_cumulative[index],
  }))

  // Format metrics
  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`
  const formatNumber = (value: number) => value.toFixed(2)

  return (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>Backtest Results ({years} years)</h3>

      {/* Metrics Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Strategy Metrics</h4>
          <div style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
            <div>Return: <strong>{formatPercent(data.strategy_metrics.annualized_return)}</strong></div>
            <div>Sharpe: <strong>{formatNumber(data.strategy_metrics.sharpe_ratio)}</strong></div>
            <div>Max DD: <strong>{formatPercent(data.strategy_metrics.max_drawdown)}</strong></div>
            <div>Volatility: <strong>{formatPercent(data.strategy_metrics.volatility)}</strong></div>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Benchmark Metrics</h4>
          <div style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
            <div>Return: <strong>{formatPercent(data.benchmark_metrics.annualized_return)}</strong></div>
            <div>Sharpe: <strong>{formatNumber(data.benchmark_metrics.sharpe_ratio)}</strong></div>
            <div>Max DD: <strong>{formatPercent(data.benchmark_metrics.max_drawdown)}</strong></div>
            <div>Volatility: <strong>{formatPercent(data.benchmark_metrics.volatility)}</strong></div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Cumulative Returns</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="strategy"
              stroke="#0070f3"
              strokeWidth={2}
              name="Strategy"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#6b7280"
              strokeWidth={2}
              name="Benchmark"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
