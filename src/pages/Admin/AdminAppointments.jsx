import { useState } from 'react';
import { mockAppointments } from '../../data/mockData';
import './AdminForms.css';
import './AdminAppointments.css';

const statusColors = { confirmed: 'confirmed', pending: 'pending', cancelled: 'cancelled' };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewItem, setViewItem] = useState(null);

  const filtered = appointments.filter(a => {
    const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, status) => {
    setAppointments(list => list.map(a => a.id === id ? { ...a, status } : a));
    setViewItem(v => v?.id === id ? { ...v, status } : v);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Appointments</div>
          <div className="admin-page-subtitle">
            {appointments.filter(a => a.status === 'pending').length} pending · {appointments.filter(a => a.status === 'confirmed').length} confirmed
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="appt-summary">
        {[
          { label: 'Total',     count: appointments.length,                                                   color: '#1B2B4B' },
          { label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length, color: '#16a34a' },
          { label: 'Pending', count: appointments.filter(a => a.status === 'pending').length, color: '#ca8a04' },
          { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="appt-summary-card" style={{ borderTopColor: s.color }}>
            <div className="asc-count" style={{ color: s.color }}>{s.count}</div>
            <div className="asc-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Appointments</span>
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="search-input" placeholder="Search…" value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="td-client">
                      <div className="td-avatar">{a.client.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      <div>
                        <div className="td-name">{a.client}</div>
                        <div className="td-company">{a.company}</div>
                      </div>
                    </div>
                  </td>
                  <td>{a.service}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: 13 }}>{a.date}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</div>
                  </td>
                  <td><span className={`status-badge status-${statusColors[a.status]}`}>{a.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="act-btn view" onClick={() => setViewItem(a)}>View</button>
                      {a.status === 'pending' && (
                        <button className="act-btn confirm" onClick={() => updateStatus(a.id, 'confirmed')}>Confirm</button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button className="act-btn delete" onClick={() => updateStatus(a.id, 'cancelled')}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewItem && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button className="modal-close" onClick={() => setViewItem(null)}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div className="appt-detail-grid">
                {[
                  ['Client', viewItem.client],
                  ['Company', viewItem.company],
                  ['Email', viewItem.email],
                  ['Phone', viewItem.phone],
                  ['Service', viewItem.service],
                  ['Date', viewItem.date],
                  ['Time', viewItem.time],
                ].map(([label, val]) => (
                  <div key={label} className="appt-detail-row">
                    <span className="apdt-label">{label}</span>
                    <span className="apdt-val">{val}</span>
                  </div>
                ))}
                <div className="appt-detail-row">
                  <span className="apdt-label">Status</span>
                  <span className={`status-badge status-${viewItem.status}`}>{viewItem.status}</span>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: 20, paddingTop: 16 }}>
                {viewItem.status === 'pending' && (
                  <button className="act-btn confirm" style={{ padding: '8px 18px' }}
                    onClick={() => updateStatus(viewItem.id, 'confirmed')}>
                    Confirm
                  </button>
                )}
                {viewItem.status !== 'cancelled' && (
                  <button className="act-btn delete" style={{ padding: '8px 18px' }}
                    onClick={() => updateStatus(viewItem.id, 'cancelled')}>
                    Cancel Appointment
                  </button>
                )}
                <button className="act-btn view" onClick={() => setViewItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
