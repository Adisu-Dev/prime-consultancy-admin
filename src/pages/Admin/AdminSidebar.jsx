import { useAuth, ROLE_PERMISSIONS } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard',    section: 'MAIN',    badge: null },
  { id: 'appointments', icon: '📅', label: 'Appointments', section: 'MANAGE',  badge: 8 },
  { id: 'inquiries',    icon: '💬', label: 'Inquiries',    section: 'MANAGE',  badge: 3 },
  { id: 'services',     icon: '🎯', label: 'Services',     section: 'CONTENT', badge: null },
  { id: 'blog',         icon: '📝', label: 'Blog & Posts', section: 'CONTENT', badge: null },
];

export default function AdminSidebar({ active, onNavigate, open, onToggle, isMobile }) {
  const { logout, currentUser, canAccess } = useAuth();
  const role = currentUser?.role || 'super_admin';
  const roleInfo = ROLE_PERMISSIONS[role];
  const showLabels = isMobile ? true : open;

  const visibleItems = navItems.filter(item => {
    if (role === 'super_admin') return true;
    if (item.id === 'dashboard') return false;
    return canAccess(item.id);
  });

  const sections = [...new Set(visibleItems.map(i => i.section))];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sb-logo-icon">P</div>
        {showLabels && (
          <div className="sb-logo-text">
            <div className="sb-logo-name">PRIME</div>
            <div className="sb-logo-sub">ADMIN PORTAL</div>
          </div>
        )}
        {isMobile && (
          <button onClick={onToggle}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close sidebar">×</button>
        )}
      </div>
      {showLabels && (
        <div style={{ margin: '8px 12px', padding: '6px 12px', background: `${roleInfo?.color}22`, border: `1px solid ${roleInfo?.color}44`, borderRadius: 8, textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: roleInfo?.color, textTransform: 'uppercase', letterSpacing: 1 }}>
            {roleInfo?.label || role}
          </span>
        </div>
      )}
      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="sidebar-section-label">{section}</div>
            {visibleItems.filter(i => i.section === section).map(item => (
              <button key={item.id}
                className={`sb-nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={!showLabels ? item.label : undefined}>
                <span className="sb-icon">{item.icon}</span>
                {showLabels && <span className="sb-label">{item.label}</span>}
                {item.badge && showLabels && <span className="sb-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sb-nav-item" onClick={logout}>
          <span className="sb-icon">🚪</span>
          {showLabels && <span className="sb-label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
