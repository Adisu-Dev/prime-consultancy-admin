import { useState } from 'react';
import { mockBlogPosts } from '../../data/mockData';
import { useValidation, rules } from '../../hooks/useValidation';
import './AdminForms.css';

const blogRules = {
  title:    [rules.required('Title'), rules.minLen(10, 'Title'), rules.maxLen(120, 'Title')],
  category: [rules.required('Category')],
  author:   [rules.required('Author')],
  content:  [rules.required('Content'), rules.minLen(50, 'Content')],
};

const categories = ['Business Strategy', 'Project Management', 'Organizational Development', 'Research', 'Capacity Building'];

function BlogModal({ post, onClose, onSave }) {
  const isEdit = !!post?.id;
  const [form, setForm] = useState({
    title:    post?.title    || '',
    category: post?.category || '',
    author:   post?.author   || '',
    status:   post?.status   || 'draft',
    content:  post?.content  || '',
  });
  const { errors, touched, touch, validateAll } = useValidation(blogRules);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) touch(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll(form)) return;
    onSave({
      ...post, ...form,
      id: post?.id || Date.now(),
      date: new Date().toISOString().split('T')[0],
      views: post?.views || 0,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Post' : 'Create New Post'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className={`mf-group ${touched.title && errors.title ? 'has-error' : touched.title ? 'has-success' : ''}`}>
            <label>Post Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              onBlur={e => touch(e.target.name, e.target.value)}
              placeholder="Enter a compelling post title…" />
            {touched.title && errors.title && <p className="mf-error">{errors.title}</p>}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{form.title.length}/120</span>
          </div>

          <div className="mf-row">
            <div className={`mf-group ${touched.category && errors.category ? 'has-error' : touched.category ? 'has-success' : ''}`}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                onBlur={e => touch(e.target.name, e.target.value)}>
                <option value="">Select category…</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {touched.category && errors.category && <p className="mf-error">{errors.category}</p>}
            </div>

            <div className={`mf-group ${touched.author && errors.author ? 'has-error' : touched.author ? 'has-success' : ''}`}>
              <label>Author *</label>
              <input name="author" value={form.author} onChange={handleChange}
                onBlur={e => touch(e.target.name, e.target.value)}
                placeholder="Author name" />
              {touched.author && errors.author && <p className="mf-error">{errors.author}</p>}
            </div>
          </div>

          <div className="mf-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className={`mf-group ${touched.content && errors.content ? 'has-error' : touched.content ? 'has-success' : ''}`}>
            <label>Content * <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>(min 50 chars)</span></label>
            <textarea name="content" rows={6} value={form.content} onChange={handleChange}
              onBlur={e => touch(e.target.name, e.target.value)}
              placeholder="Write your article content here…" />
            {touched.content && errors.content && <p className="mf-error">{errors.content}</p>}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{form.content.length} characters</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="act-btn view" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-sm">
              {isEdit ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [posts, setPosts] = useState(mockBlogPosts);
  const [modalData, setModalData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (updated) => {
    if (updated.id && posts.find(p => p.id === updated.id)) {
      setPosts(pp => pp.map(p => p.id === updated.id ? updated : p));
    } else {
      setPosts(pp => [...pp, updated]);
    }
    setModalData(null);
  };

  const deletePost = (id) => setPosts(pp => pp.filter(p => p.id !== id));

  const toggleStatus = (id) => {
    setPosts(pp => pp.map(p => p.id === id
      ? { ...p, status: p.status === 'published' ? 'draft' : 'published' }
      : p
    ));
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Blog &amp; Insights</div>
          <div className="admin-page-subtitle">
            {posts.filter(p => p.status === 'published').length} published · {posts.filter(p => p.status === 'draft').length} drafts
          </div>
        </div>
        <button className="btn-primary-sm" onClick={() => setModalData({})}>+ New Post</button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Posts</span>
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="search-input" placeholder="Search posts…" value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: 13, lineHeight: 1.4 }}>
                      {p.title}
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.author}</td>
                  <td>{p.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{p.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className={`status-badge status-${p.status}`}
                      style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      title="Click to toggle status"
                    >
                      {p.status}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="act-btn edit" onClick={() => setModalData(p)}>Edit</button>
                      <button className="act-btn delete" onClick={() => deletePost(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No posts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalData !== null && (
        <BlogModal post={modalData} onClose={() => setModalData(null)} onSave={handleSave} />
      )}
    </div>
  );
}
