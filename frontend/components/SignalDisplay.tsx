import { SignalResponse } from '@/types/api'

interface SignalDisplayProps {
  signal: SignalResponse | null
  loading: boolean
}

export default function SignalDisplay({ signal, loading }: SignalDisplayProps) {
  if (loading) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Trading Signal</h3>
        <p>Loading...</p>
      </div>
    )
  }

  if (!signal) {
    return (
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Trading Signal</h3>
        <p style={{ color: '#666' }}>No signal available</p>
      </div>
    )
  }

  const getSignalColor = () => {
    if (signal.action === 'BUY') return '#22c55e' // green
    if (signal.action === 'SELL') return '#ef4444' // red
    return '#6b7280' // gray for HOLD
  }

  const getSignalBgColor = () => {
    if (signal.action === 'BUY') return '#dcfce7' // light green
    if (signal.action === 'SELL') return '#fee2e2' // light red
    return '#f3f4f6' // light gray for HOLD
  }

  return (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem' }}>Trading Signal</h3>
      
      <div
        style={{
          padding: '1.5rem',
          background: getSignalBgColor(),
          borderRadius: '8px',
          border: `2px solid ${getSignalColor()}`,
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: '700', color: getSignalColor(), marginBottom: '0.5rem' }}>
          {signal.action}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Confidence: {(signal.confidence * 100).toFixed(1)}%
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Weighted Signal: {signal.weighted_signal.toFixed(3)}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Regime Probabilities:</div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
          <span>Bull: {(signal.regime_probs[0] * 100).toFixed(1)}%</span>
          <span>Bear: {(signal.regime_probs[1] * 100).toFixed(1)}%</span>
          <span>Sideways: {(signal.regime_probs[2] * 100).toFixed(1)}%</span>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Last updated: {new Date(signal.timestamp).toLocaleString()}
      </p>
    </div>
  )
}
