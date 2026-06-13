import { useAuth, ROLE_PERMISSIONS } from '../../context/AuthContext';

const viewTitles = {
  dashboard: 'Dashboard', appointments: 'Appointments',
  inquiries: 'Inquiries', services: 'Services', blog: 'Blog',
};

export default function AdminHeader({ onMenuToggle, activeView, user }) {
  const { logout } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AU';
  const roleInfo = ROLE_PERMISSIONS[user?.role] || {};

  return (
    <header className="admin-header">
      <div className="ah-left">
        <button className="ah-menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <span /><span /><span />
        </button>
        <div className="ah-breadcrumb">
          <span>Admin / </span>{viewTitles[activeView] || activeView}
        </div>
      </div>
      <div className="ah-right">
        <button className="ah-icon-btn" aria-label="Notifications">🔔<span className="ah-notif-dot" /></button>
        <div className="ah-user" onClick={logout} title="Click to sign out" role="button" tabIndex={0}>
          <div className="ah-avatar" style={{ background: roleInfo.color || 'var(--navy)' }}>{initials}</div>
          <div className="ah-user-info">
            <div className="ah-user-name">{user?.name || 'Admin'}</div>
            <div className="ah-user-role">{roleInfo.label || user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
