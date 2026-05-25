import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Savings() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [fixedPrice, setFixedPrice] = useState('0.15')
  const [powerKwh, setPowerKwh] = useState('2')

  const loadData = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (fixedPrice) params.append('fixedPrice', fixedPrice)
    if (powerKwh) params.append('powerKwh', powerKwh)

    api.get(`/api/savings?${params.toString()}`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Ошибка загрузки отчёта')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRecalculate = () => {
    setError('')
    loadData()
  }

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

      {/* Блок настроек сравнения */}
      <div style={{ padding: '20px', border: '1px solid #444', borderRadius: '8px', marginBottom: '20px', background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0 }}>📊 Сравнение с фиксированным пакетом</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
              Цена фиксированного пакета (€/kWh)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#222', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
              Мощность устройства (kWh/час)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={powerKwh}
              onChange={(e) => setPowerKwh(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', background: '#222', color: '#fff' }}
            />
          </div>
          <button
            onClick={handleRecalculate}
            style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Пересчитать
          </button>
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

          {/* Блок сравнения с фиксом */}
          {data.fixed_comparison && (
            <div style={{ marginTop: '20px' }}>
              <h3>📈 Результаты сравнения</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '20px', border: '1px solid #8b5cf6', borderRadius: '8px' }}>
                  <h4 style={{ color: '#8b5cf6', marginTop: 0 }}>💡 Умный режим</h4>
                  <p style={{ fontSize: '1.6em', fontWeight: 'bold', margin: '10px 0' }}>
                    {data.fixed_comparison.cost_smart} €
                  </p>
                  <p style={{ color: '#888', fontSize: '0.9em' }}>Динамическая цена</p>
                </div>

                <div style={{ padding: '20px', border: '1px solid #6b7280', borderRadius: '8px' }}>
                  <h4 style={{ color: '#9ca3af', marginTop: 0 }}>📦 Фиксированный пакет</h4>
                  <p style={{ fontSize: '1.6em', fontWeight: 'bold', margin: '10px 0' }}>
                    {data.fixed_comparison.cost_fixed} €
                  </p>
                  <p style={{ color: '#888', fontSize: '0.9em' }}>
                    {data.fixed_comparison.fixed_price} €/kWh × {data.hours_on} ч
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  border: `2px solid ${data.fixed_comparison.is_smart_better ? '#22c55e' : '#ef4444'}`,
                  borderRadius: '8px',
                  background: data.fixed_comparison.is_smart_better ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <h4 style={{
                    color: data.fixed_comparison.is_smart_better ? '#22c55e' : '#ef4444',
                    marginTop: 0
                  }}>
                    {data.fixed_comparison.is_smart_better ? '✅ Экономия' : '⚠️ Переплата'}
                  </h4>
                  <p style={{ fontSize: '1.6em', fontWeight: 'bold', margin: '10px 0' }}>
                    {Math.abs(data.fixed_comparison.savings_vs_fixed).toFixed(2)} €
                  </p>
                  <p style={{ color: '#888', fontSize: '0.9em' }}>
                    {data.fixed_comparison.is_smart_better ? '+' : '-'}{Math.abs(data.fixed_comparison.savings_percent).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '15px', padding: '15px', background: '#1a1a1a', borderRadius: '8px', color: '#aaa', fontSize: '0.9em' }}>
                {data.fixed_comparison.is_smart_better ? (
                  <>
                    🎉 Умное управление выгоднее фиксированного пакета на <b style={{ color: '#22c55e' }}>{data.fixed_comparison.savings_vs_fixed.toFixed(2)} €</b> за {data.period_days} дней.
                  </>
                ) : (
                  <>
                    📉 Фиксированный пакет был бы выгоднее на <b style={{ color: '#ef4444' }}>{Math.abs(data.fixed_comparison.savings_vs_fixed).toFixed(2)} €</b>. Возможно, стоит пересмотреть пороговую цену.
                  </>
                )}
              </div>
            </div>
          )}

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