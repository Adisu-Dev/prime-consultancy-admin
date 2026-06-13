import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboard from './AdminDashboard';
import AdminServices from './AdminServices';
import AdminAppointments from './AdminAppointments';
import AdminInquiries from './AdminInquiries';
import AdminBlog from './AdminBlog';
import './AdminLayout.css';

const pathToView = {
  'dashboard': 'dashboard',
  'appointments': 'appointments',
  'inquiries': 'inquiries',
  'services': 'services',
  'blog': 'blog',
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, canAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const segment = location.pathname.split('/').pop();
  const activeView = pathToView[segment] || 'dashboard';

  const defaultPath = () => {
    if (currentUser?.role === 'super_admin') return '/dashboard';
    const perms = ['appointments', 'inquiries', 'services', 'blog'];
    const first = perms.find(p => canAccess(p));
    return first ? `/${first}` : '/dashboard';
  };

  const handleNavigate = (view) => {
    navigate(`/${view}`);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {isMobile && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
      <AdminSidebar
        active={activeView}
        onNavigate={handleNavigate}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(s => !s)}
        isMobile={isMobile}
      />
      <div className="admin-main">
        <AdminHeader onMenuToggle={() => setSidebarOpen(s => !s)} activeView={activeView} user={currentUser} />
        <div className="admin-content">
          <Routes>
            <Route index element={<Navigate to={defaultPath()} replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="inquiries"    element={<AdminInquiries />} />
            <Route path="services"     element={<AdminServices />} />
            <Route path="blog"         element={<AdminBlog />} />
            <Route path="*"            element={<Navigate to={defaultPath()} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
