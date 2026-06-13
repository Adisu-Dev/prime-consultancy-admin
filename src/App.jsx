import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './pages/Login/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import './App.css';

function AdminRoute() {
  const { currentUser, isAdminRole } = useAuth();
  if (!currentUser)  return <Navigate to="/login" replace />;
  if (!isAdminRole)  return <Navigate to="/login" replace />;
  return <AdminLayout />;
}

function LoginRoute() {
  const { currentUser, isAdminRole } = useAuth();
  if (currentUser && isAdminRole) return <Navigate to="/dashboard" replace />;
  return <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<LoginRoute />} />
          <Route path="/"         element={<Navigate to="/login" replace />} />
          <Route path="/*"        element={<AdminRoute />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
