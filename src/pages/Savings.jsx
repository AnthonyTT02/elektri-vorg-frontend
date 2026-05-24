import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Savings() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/savings')
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Ошибка загрузки отчёта')
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Отчёт экономии (30 дней)</h2>
        <div>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/forecast" style={{ marginRight: '15px' }}>Прогноз</Link>
          <Link to="/devices">Устройства</Link>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Загрузка...</p>}

      {data && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #22c55e', borderRadius: '8px' }}>
              <h3 style={{ color: '#22c55e' }}>🟢 Часов включён</h3>
              <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{data.hours_on}</p>
              <p style={{ color: '#888' }}>Средняя цена: {data.avg_price_on} €/MWh</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #ef4444', borderRadius: '8px' }}>
              <h3 style={{ color: '#ef4444' }}>🔴 Часов выключен</h3>
              <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{data.hours_off}</p>
              <p style={{ color: '#888' }}>Средняя цена: {data.avg_price_off} €/MWh</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #3b82f6', borderRadius: '8px' }}>
              <h3 style={{ color: '#3b82f6' }}>💰 Потрачено (умный режим)</h3>
              <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{data.total_cost_smart} €</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #f59e0b', borderRadius: '8px' }}>
              <h3 style={{ color: '#f59e0b' }}>⚡ Экономия</h3>
              <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{data.savings} €</p>
              <p style={{ color: '#888' }}>За {data.period_days} дней</p>
            </div>
          </div>

          {data.hours_on === 0 && data.hours_off === 0 && (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
              Данных пока нет — система начнёт собирать статистику когда устройства будут активны.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Savings