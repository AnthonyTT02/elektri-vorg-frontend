import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
  const [boilerData, setBoilerData] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchStatus = async () => {
    try {
      const res = await api.get('/api/boiler/status')
      setBoilerData(res.data)
    } catch (err) {
      setError('Ошибка загрузки данных')
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Elektri Vorg — Dashboard</h2>
        <div>
          <Link to="/devices" style={{ marginRight: '15px' }}>Устройства</Link>
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

          <button onClick={fetchStatus} style={{ padding: '10px 20px' }}>
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