import { useState } from 'react';
import { mockInquiries } from '../../data/mockData';
import './AdminForms.css';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewItem, setViewItem] = useState(null);

  const filtered = inquiries.filter(i => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const markResponded = (id) => {
    setInquiries(list => list.map(i => i.id === id ? { ...i, status: 'responded' } : i));
    setViewItem(v => v?.id === id ? { ...v, status: 'responded' } : v);
  };

  const deleteInquiry = (id) => {
    setInquiries(list => list.filter(i => i.id !== id));
    setViewItem(null);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Contact Inquiries</div>
          <div className="admin-page-subtitle">
            {inquiries.filter(i => i.status === 'new').length} new · {inquiries.filter(i => i.status === 'responded').length} responded
          </div>
        </div>
        <button className="btn-primary-sm" onClick={() => {
          // Export as JSON (demo)
          const blob = new Blob([JSON.stringify(inquiries, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'inquiries.json'; a.click();
        }}>
          ⬇ Export
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Inquiries</span>
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="search-input" placeholder="Search inquiries…" value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="responded">Responded</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Service</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => (
                <tr key={inq.id}>
                  <td>
                    <div className="td-client">
                      <div className="td-avatar" style={{ background: 'var(--navy-mid)' }}>
                        {inq.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="td-name">{inq.name}</div>
                        <div className="td-company">{inq.company}</div>
                      </div>
                    </div>
                  </td>
                  <td>{inq.service}</td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                      {inq.message}
                    </div>
                  </td>
                  <td>{inq.date}</td>
                  <td><span className={`status-badge status-${inq.status}`}>{inq.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="act-btn view" onClick={() => setViewItem(inq)}>View</button>
                      {inq.status === 'new' && (
                        <button className="act-btn confirm" onClick={() => markResponded(inq.id)}>Respond</button>
                      )}
                      <button className="act-btn delete" onClick={() => deleteInquiry(inq.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewItem && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>Inquiry Details</h3>
              <button className="modal-close" onClick={() => setViewItem(null)}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              {[
                ['From', viewItem.name],
                ['Company', viewItem.company],
                ['Email', viewItem.email],
                ['Service', viewItem.service],
                ['Date', viewItem.date],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-dark)', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, background: 'var(--off-white)', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</div>
                <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.7 }}>{viewItem.message}</p>
              </div>
              <div className="modal-actions" style={{ marginTop: 20, paddingTop: 16 }}>
                {viewItem.status === 'new' && (
                  <button className="btn-primary-sm" onClick={() => markResponded(viewItem.id)}>Mark as Responded</button>
                )}
                <button className="act-btn delete" style={{ padding: '8px 18px' }} onClick={() => deleteInquiry(viewItem.id)}>Delete</button>
                <button className="act-btn view" onClick={() => setViewItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
