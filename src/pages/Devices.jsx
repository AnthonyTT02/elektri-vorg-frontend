import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Devices() {
  const [devices, setDevices] = useState([])
  const [error, setError] = useState('')
  const [newDevice, setNewDevice] = useState({ name: '', description: '', ip_address: '', threshold_eur: '' })
  const [showForm, setShowForm] = useState(false)

  const fetchDevices = async () => {
    try {
      const res = await api.get('/api/devices')
      setDevices(res.data)
    } catch (err) {
      setError('Ошибка загрузки устройств')
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/devices', newDevice)
      setNewDevice({ name: '', description: '', ip_address: '', threshold_eur: '' })
      setShowForm(false)
      fetchDevices()
    } catch (err) {
      setError('Ошибка добавления устройства')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить устройство?')) return
    try {
      await api.delete(`/api/devices/${id}`)
      fetchDevices()
    } catch (err) {
      setError('Ошибка удаления')
    }
  }

  const handleOverride = async (id) => {
    try {
      await api.post(`/api/devices/${id}/override`)
      fetchDevices()
    } catch (err) {
      setError('Ошибка управления устройством')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Устройства</h2>
        <div>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showForm && (
        <form onSubmit={handleAdd} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '15px' }}>
          <h3>Новое устройство</h3>
          <input placeholder="Название" value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="Описание" value={newDevice.description}
            onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="IP адрес" value={newDevice.ip_address}
            onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="Порог €/MWh" type="number" value={newDevice.threshold_eur}
            onChange={(e) => setNewDevice({ ...newDevice, threshold_eur: e.target.value })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <button type="submit" style={{ padding: '10px 20px' }}>Сохранить</button>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        {devices.length === 0 ? (
          <p>Устройств нет. Добавьте первое!</p>
        ) : (
          devices.map((device) => (
            <div key={device.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{device.name}</strong>
                  <p style={{ margin: '4px 0' }}>{device.description}</p>
                  <p style={{ margin: '4px 0', color: '#666' }}>IP: {device.ip_address} | Порог: {device.threshold_eur} €/MWh</p>
                  <p style={{ margin: '4px 0' }}>
                    Статус: {device.is_override ? '🔧 Ручной режим' : '🤖 Авто'} —
                    {device.override_status ? ' 🟢 Вкл' : ' 🔴 Выкл'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button onClick={() => handleOverride(device.id)}>Управление</button>
                  <button onClick={() => handleDelete(device.id)} style={{ color: 'red' }}>Удалить</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Devices