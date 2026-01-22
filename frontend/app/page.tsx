'use client'

import { useState, useEffect } from 'react'
import ApiMethods from '@/components/ApiMethods'
import RegimeDisplay from '@/components/RegimeDisplay'
import SignalDisplay from '@/components/SignalDisplay'
import BacktestResults from '@/components/BacktestResults'
import { RegimeResponse, SignalResponse } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [regime, setRegime] = useState<RegimeResponse | null>(null)
  const [signal, setSignal] = useState<SignalResponse | null>(null)
  const [regimeLoading, setRegimeLoading] = useState(false)
  const [signalLoading, setSignalLoading] = useState(false)
  const [backtestYears, setBacktestYears] = useState(10)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    fetchRegime()
    fetchSignal()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchRegime()
      fetchSignal()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const fetchRegime = async () => {
    try {
      setRegimeLoading(true)
      const response = await fetch(`${API_URL}/regime/latest`)
      if (!response.ok) throw new Error('Failed to fetch regime')
      const data = await response.json()
      setRegime(data)
    } catch (error) {
      console.error('Error fetching regime:', error)
    } finally {
      setRegimeLoading(false)
    }
  }

  const fetchSignal = async () => {
    try {
      setSignalLoading(true)
      const response = await fetch(`${API_URL}/signal/latest`)
      if (!response.ok) throw new Error('Failed to fetch signal')
      const data = await response.json()
      setSignal(data)
    } catch (error) {
      console.error('Error fetching signal:', error)
    } finally {
      setSignalLoading(false)
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>
          Regime-Switching Trading Engine
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Monitor market regimes, trading signals, and backtest results
        </p>
      </div>

      {/* Auto-refresh toggle */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem' }}>Auto-refresh every 30 seconds</span>
        </label>
        <button
          onClick={() => {
            fetchRegime()
            fetchSignal()
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Refresh Now
        </button>
      </div>

      {/* Regime and Signal Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <RegimeDisplay regime={regime} loading={regimeLoading} />
        <SignalDisplay signal={signal} loading={signalLoading} />
      </div>

      {/* Backtest Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Backtest Results</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Years:</label>
            <select
              value={backtestYears}
              onChange={(e) => setBacktestYears(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              {[1, 2, 3, 5, 10, 15, 20].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
            Note: Stock symbol is configured via backend environment variable (SYMBOL)
          </p>
        </div>
        <BacktestResults years={backtestYears} />
      </div>

      {/* API Methods Section */}
      <div style={{ marginTop: '3rem' }}>
        <ApiMethods apiUrl={API_URL} />
      </div>
    </main>
  )
}
