import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputTimbangan from './pages/InputTimbangan';
import RiwayatData from './pages/RiwayatData';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="input-timbangan" element={<InputTimbangan />} />
        <Route path="riwayat" element={<RiwayatData />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
