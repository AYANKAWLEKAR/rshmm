'use client'

import { useState } from 'react'
import { HealthResponse, RegimeResponse, SignalResponse } from '@/types/api'

interface ApiMethodsProps {
  apiUrl: string
}

export default function ApiMethods({ apiUrl }: ApiMethodsProps) {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null)
  const [regimeData, setRegimeData] = useState<RegimeResponse | null>(null)
  const [signalData, setSignalData] = useState<SignalResponse | null>(null)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  const setLoadingState = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }))
  }

  const setErrorState = (key: string, value: string | null) => {
    setErrors((prev) => ({ ...prev, [key]: value }))
  }

  const testEndpoint = async (endpoint: string, key: string, setter: (data: any) => void) => {
    try {
      setLoadingState(key, true)
      setErrorState(key, null)
      const response = await fetch(`${apiUrl}${endpoint}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed' }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }
      const data = await response.json()
      setter(data)
    } catch (err) {
      setErrorState(key, err instanceof Error ? err.message : 'An error occurred')
      console.error(`Error testing ${endpoint}:`, err)
    } finally {
      setLoadingState(key, false)
    }
  }

  const endpoints = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/health',
      key: 'health',
      description: 'Check API health status',
      test: () => testEndpoint('/health', 'health', setHealthStatus),
      result: healthStatus,
    },
    {
      name: 'Latest Regime',
      method: 'GET',
      path: '/regime/latest',
      key: 'regime',
      description: 'Get latest regime probabilities (bull, bear, sideways)',
      test: () => testEndpoint('/regime/latest', 'regime', setRegimeData),
      result: regimeData,
    },
    {
      name: 'Latest Signal',
      method: 'GET',
      path: '/signal/latest',
      key: 'signal',
      description: 'Get latest trading signal (BUY/SELL/HOLD)',
      test: () => testEndpoint('/signal/latest', 'signal', setSignalData),
      result: signalData,
    },
  ]

  return (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>API Methods</h3>
      <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
        Test all available API endpoints
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.key}
            style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: '#f9fafb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#0070f3',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {endpoint.method}
                  </span>
                  <code style={{ fontSize: '0.875rem', fontWeight: '500' }}>{endpoint.path}</code>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                  {endpoint.description}
                </p>
              </div>
              <button
                onClick={endpoint.test}
                disabled={loading[endpoint.key]}
                style={{
                  padding: '0.5rem 1rem',
                  background: loading[endpoint.key] ? '#9ca3af' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: loading[endpoint.key] ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading[endpoint.key] ? 'Testing...' : 'Test'}
              </button>
            </div>

            {errors[endpoint.key] && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>Error: {errors[endpoint.key]}</p>
              </div>
            )}

            {endpoint.result && !errors[endpoint.key] && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#dcfce7', borderRadius: '4px' }}>
                <pre style={{ fontSize: '0.75rem', overflow: 'auto', margin: 0 }}>
                  {JSON.stringify(endpoint.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}

        <div
          style={{
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            background: '#f9fafb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#0070f3',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  GET
                </span>
                <code style={{ fontSize: '0.875rem', fontWeight: '500' }}>/backtest?years=10</code>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                Get backtest results (years parameter: 1-20)
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
            Use the backtest form below to test this endpoint
          </p>
        </div>
      </div>
    </div>
  )
}
