import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts'
import api from '../services/api'

function Forecast() {
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/forecast')
      .then((res) => {
        const data = res.data.map((item) => ({
          time: new Date(item.time).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' }),
          price: item.price,
          below_threshold: item.below_threshold,
        }))
        setForecast(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Ошибка загрузки прогноза')
        setLoading(false)
      })
  }, [])

  const threshold = 0.1

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Прогноз цен на 24 часа</h2>
        <div>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/devices">Устройства</Link>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Загрузка...</p>}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
            <span>🟢 Бойлер включён (ниже порога)</span>
            <span>🔴 Бойлер выключен (выше порога)</span>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={forecast} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value} €/MWh`, 'Цена']} />
              <ReferenceLine y={threshold} stroke="orange" strokeDasharray="5 5" label={{ value: 'Порог', position: 'right', fill: 'orange' }} />
              <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                {forecast.map((entry, index) => (
                  <Cell key={index} fill={entry.below_threshold ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '20px' }}>
            <h3>Часы с дешёвым электричеством:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {forecast.filter(f => f.below_threshold).map((item, i) => (
                <span key={i} style={{ padding: '4px 10px', background: '#22c55e', borderRadius: '4px', color: 'white', fontSize: '0.9em' }}>
                  {item.time}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Forecast