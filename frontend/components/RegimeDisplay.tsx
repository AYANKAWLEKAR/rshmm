import { RegimeResponse } from '@/types/api'

interface RegimeDisplayProps {
  regime: RegimeResponse | null
  loading: boolean
}

export default function RegimeDisplay({ regime, loading }: RegimeDisplayProps) {
  if (loading) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Current Regime Probabilities</h3>
        <p>Loading...</p>
      </div>
    )
  }

  if (!regime) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Current Regime Probabilities</h3>
        <p style={{ color: '#666' }}>No data available</p>
      </div>
    )
  }

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

  return (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>Current Regime Probabilities</h3>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>Bull Market</span>
            <span style={{ fontWeight: '600', color: '#22c55e' }}>{formatPercent(regime.bull_probability)}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${regime.bull_probability * 100}%`,
                height: '100%',
                background: '#22c55e',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>Bear Market</span>
            <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatPercent(regime.bear_probability)}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${regime.bear_probability * 100}%`,
                height: '100%',
                background: '#ef4444',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>Sideways Market</span>
            <span style={{ fontWeight: '600', color: '#6b7280' }}>{formatPercent(regime.sideways_probability)}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${regime.sideways_probability * 100}%`,
                height: '100%',
                background: '#6b7280',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
        Last updated: {new Date(regime.timestamp).toLocaleString()}
      </p>
    </div>
  )
}
