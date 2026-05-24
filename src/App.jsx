import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Forecast from './pages/Forecast'
import Savings from './pages/Savings'

function App() {
  const token = localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/devices" element={token ? <Devices /> : <Navigate to="/login" />} />
      <Route path="/forecast" element={token ? <Forecast /> : <Navigate to="/login" />} />
      <Route path="/savings" element={token ? <Savings /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App