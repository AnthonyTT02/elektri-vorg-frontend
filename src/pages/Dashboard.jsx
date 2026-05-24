import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
  const [boilerData, setBoilerData] = useState(null)
  const [error, setError] = useState('')
  const [wsStatus, setWsStatus] = useState('Подключение...')
  const navigate = useNavigate()
  const wsRef = useRef(null)

  const connectWebSocket = () => {
    const wsUrl = 'ws://rwymo8fzm2o2eoet81n3bb7x.176.112.158.15.sslip.io'
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setWsStatus('🟢 Live')
      setError('')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setBoilerData(data)
    }

    ws.onerror = () => {
      setWsStatus('🔴 Ошибка')
    }

    ws.onclose = () => {
      setWsStatus('🟡 Переподключение...')
      setTimeout(connectWebSocket, 3000)
    }
  }

  useEffect(() => {
    api.get('/api/boiler/status').then((res) => setBoilerData(res.data)).catch(() => {})
    connectWebSocket()

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Elektri Vorg — Dashboard <span style={{ fontSize: '0.5em', color: '#888' }}>{wsStatus}</span></h2>
        <div>
          <Link to="/devices" style={{ marginRight: '15px' }}>Устройства</Link>
          <Link to="/forecast" style={{ marginRight: '15px' }}>Прогноз</Link>
          <Link to="/savings" style={{ marginRight: '15px' }}>Экономия</Link>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {boilerData ? (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '15px' }}>
            <h3>Текущая цена электричества</h3>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>
              {boilerData.current_price_eur} €/MWh
            </p>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '15px' }}>
            <h3>Статус бойлера</h3>
            <p style={{ fontSize: '1.5em' }}>
              {boilerData.status === 'ON' ? '🟢 Включён' : '🔴 Выключен'}
            </p>
            <p>Порог: {boilerData.threshold} €/MWh</p>
          </div>

          <button onClick={() => api.get('/api/boiler/status').then(r => setBoilerData(r.data))} style={{ padding: '10px 20px' }}>
            Обновить
          </button>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  )
}

export default Dashboard