import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Admin() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users')
      setUsers(res.data)
    } catch (err) {
      setError('Нет доступа или ошибка загрузки')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeactivate = async (id, isActive) => {
    try {
      await api.put(`/api/admin/users/${id}/status`, { is_active: !isActive })
      fetchUsers()
    } catch (err) {
      setError('Ошибка изменения статуса')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить пользователя?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      setError('Ошибка удаления')
    }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role })
      fetchUsers()
    } catch (err) {
      setError('Ошибка изменения роли')
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>👑 Admin — Управление пользователями</h2>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {users.map((user) => (
          <div key={user.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{user.username}</strong>
                <span style={{ marginLeft: '10px', color: '#888' }}>#{user.id}</span>
                <p style={{ margin: '4px 0', color: '#888', fontSize: '0.9em' }}>
                  Роль: {user.role} | Статус: {user.is_active ? '🟢 Активен' : '🔴 Деактивирован'} | Отпуск: {user.vacation_mode ? '🏖️' : '🏠'}
                </p>
                <p style={{ margin: '4px 0', color: '#888', fontSize: '0.8em' }}>
                  Создан: {new Date(user.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button onClick={() => handleDeactivate(user.id, user.is_active)}>
                  {user.is_active ? 'Деактивировать' : 'Активировать'}
                </button>
                <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin