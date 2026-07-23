import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import './styles/orbital-portal.css'

/** Root boundary: a startup crash renders a visible message, never a white page. */
class RootBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('[root]', error, info) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ fontFamily: 'system-ui', padding: '48px 24px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, color: '#0b2530' }}>Something went wrong</h1>
        <p style={{ color: '#5a6f77', fontSize: 14 }}>{String(this.state.error?.message || this.state.error)}</p>
        <button onClick={() => { window.location.reload() }}
                style={{ padding: '10px 22px', borderRadius: 999, border: 'none',
                         background: '#1f9d77', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Reload
        </button>
      </div>
    )
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RootBoundary>
  </React.StrictMode>
)
