import { useState } from 'react';
import { mockServices } from '../../data/mockData';
import { useValidation, rules } from '../../hooks/useValidation';
import './AdminForms.css';

const serviceRules = {
  title:       [rules.required('Title'), rules.minLen(5, 'Title'), rules.maxLen(80, 'Title')],
  category:    [rules.required('Category')],
  price:       [rules.required('Price')],
  description: [rules.required('Description'), rules.minLen(20, 'Description')],
};

function ServiceModal({ service, onClose, onSave }) {
  const isEdit = !!service?.id;
  const [form, setForm] = useState({
    title:       service?.title || '',
    category:    service?.category || '',
    price:       service?.price || '',
    description: service?.description || '',
    status:      service?.status || 'active',
    icon:        service?.icon || '🎯',
  });

  const { errors, touched, touch, validateAll } = useValidation(serviceRules);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) touch(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll(form)) return;
    onSave({ ...service, ...form, id: service?.id || Date.now() });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit Service' : 'Add Service'}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Service' : 'Add New Service'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="mf-row">
            <div className={`mf-group ${touched.title && errors.title ? 'has-error' : touched.title ? 'has-success' : ''}`}>
              <label>Service Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                onBlur={e => touch(e.target.name, e.target.value)}
                placeholder="e.g. Corporate Strategy" />
              {touched.title && errors.title && <p className="mf-error">{errors.title}</p>}
            </div>

            <div className={`mf-group ${touched.category && errors.category ? 'has-error' : touched.category ? 'has-success' : ''}`}>
              <label>Category *</label>
              <input name="category" value={form.category} onChange={handleChange}
                onBlur={e => touch(e.target.name, e.target.value)}
                placeholder="e.g. Strategy" />
              {touched.category && errors.category && <p className="mf-error">{errors.category}</p>}
            </div>
          </div>

          <div className="mf-row">
            <div className={`mf-group ${touched.price && errors.price ? 'has-error' : touched.price ? 'has-success' : ''}`}>
              <label>Price *</label>
              <input name="price" value={form.price} onChange={handleChange}
                onBlur={e => touch(e.target.name, e.target.value)}
                placeholder="e.g. ETB 45,000" />
              {touched.price && errors.price && <p className="mf-error">{errors.price}</p>}
            </div>

            <div className="mf-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mf-row">
            <div className="mf-group">
              <label>Icon (emoji)</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="🎯" maxLength={4} />
            </div>
          </div>

          <div className={`mf-group ${touched.description && errors.description ? 'has-error' : touched.description ? 'has-success' : ''}`}>
            <label>Description *</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange}
              onBlur={e => touch(e.target.name, e.target.value)}
              placeholder="Brief description of the service (min. 20 chars)..." />
            {touched.description && errors.description && <p className="mf-error">{errors.description}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="act-btn view" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-sm">
              {isEdit ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState(mockServices);
  const [modalData, setModalData] = useState(null); // null = closed, {} = add, {id,...} = edit
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (updated) => {
    if (updated.id && services.find(s => s.id === updated.id)) {
      setServices(ss => ss.map(s => s.id === updated.id ? updated : s));
    } else {
      setServices(ss => [...ss, updated]);
    }
    setModalData(null);
  };

  const handleDelete = (id) => {
    setServices(ss => ss.filter(s => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Services</div>
          <div className="admin-page-subtitle">{services.length} services configured</div>
        </div>
        <button className="btn-primary-sm" onClick={() => setModalData({})}>
          + Add Service
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Services</span>
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="search-input" placeholder="Search services…" value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Requests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{s.title}</span>
                    </div>
                  </td>
                  <td>{s.category}</td>
                  <td>{s.price}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(s.requests / 80) * 100}%`, height: '100%', background: 'var(--navy)', borderRadius: 3 }} />
                      </div>
                      {s.requests}
                    </div>
                  </td>
                  <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="act-btn edit" onClick={() => setModalData(s)}>Edit</button>
                      <button className="act-btn delete" onClick={() => setDeleteId(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No services found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add modal */}
      {modalData !== null && (
        <ServiceModal
          service={modalData}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>×</button>
            </div>
            <p style={{ padding: '20px 24px', color: 'var(--text-body)', fontSize: 15 }}>
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ padding: '0 24px 20px' }}>
              <button className="act-btn view" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="act-btn delete" style={{ padding: '8px 20px' }} onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
