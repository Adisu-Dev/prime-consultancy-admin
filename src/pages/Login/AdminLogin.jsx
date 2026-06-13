import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_PERMISSIONS } from '../../context/AuthContext';
import { useValidation, rules } from '../../hooks/useValidation';
import './Login.css';

const loginRules = {
  email:    [rules.required('Email'), rules.email()],
  password: [rules.required('Password')],
};

const adminHints = [
  { role: 'Super Admin',       email: 'admin@prime.et',     pass: 'Admin@123',     icon: '🔐', color: '#1B3A6B' },
  { role: 'Content Manager',   email: 'content@prime.et',   pass: 'Content@123',   icon: '✏️', color: '#059669' },
  { role: 'Marketing Manager', email: 'marketing@prime.et', pass: 'Marketing@123', icon: '📢', color: '#7C3AED' },
];

export default function AdminLogin() {
  const { login, authError, loading } = useAuth();
  const { errors, touched, touch, validateAll } = useValidation(loginRules);
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) touch(name, value);
  };
  const handleBlur = (e) => touch(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll(form)) return;
    const result = await login(form.email, form.password);
    if (result.ok) navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-left" style={{ background: 'linear-gradient(165deg, #0D2240 0%, #1B3A6B 100%)' }}>
        <div className="login-brand">
          <div className="login-logo-icon">P</div>
          <div>
            <div className="login-logo-name">PRIME</div>
            <div className="login-logo-sub">ADMIN PORTAL</div>
          </div>
        </div>
        <div className="login-left-content">
          <h1>Admin Portal</h1>
          <p>Secure access for administrators and content managers.</p>
          <div className="login-img-wrap">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80" alt="Admin" className="login-hero-img" />
            <div className="login-img-overlay"><span>🔐</span><div>Restricted — Authorized Personnel Only</div></div>
          </div>
          <div style={{ marginTop: 20 }}>
            {Object.entries(ROLE_PERMISSIONS).map(([key, perm]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: perm.color, flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{perm.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{perm.canAccess.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h2 className="login-title">Admin Sign In</h2>
          <p className="login-subtitle">Access the Prime Consultancy management portal.</p>
          <div className="login-hints">
            <p className="hint-label">Quick demo access:</p>
            <div className="hints-row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {adminHints.map(h => (
                <button key={h.role} className="hint-card"
                  onClick={() => setForm({ email: h.email, password: h.pass })} type="button"
                  style={{ flex: '1 1 auto', minWidth: 120 }}>
                  <span className="hint-icon">{h.icon}</span>
                  <span className="hint-role" style={{ color: h.color }}>{h.role}</span>
                  <span className="hint-email">{h.email}</span>
                </button>
              ))}
            </div>
          </div>
          {authError && <div className="auth-error" role="alert">{authError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className={`lf-group ${touched.email && errors.email ? 'has-error' : touched.email ? 'has-success' : ''}`}>
              <label htmlFor="al-email">Email Address</label>
              <div className="lf-input-wrap">
                <input id="al-email" name="email" type="email" placeholder="admin@prime.et"
                  value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
              </div>
              {touched.email && errors.email && <p className="lf-error">{errors.email}</p>}
            </div>
            <div className={`lf-group ${touched.password && errors.password ? 'has-error' : touched.password ? 'has-success' : ''}`}>
              <label htmlFor="al-password">Password</label>
              <div className="lf-input-wrap">
                <input id="al-password" name="password" type={showPass ? 'text' : 'password'}
                  placeholder="Your password" value={form.password} onChange={handleChange} onBlur={handleBlur} />
                <button type="button" className="lf-toggle-pass" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁'}</button>
              </div>
              {touched.password && errors.password && <p className="lf-error">{errors.password}</p>}
            </div>
            <div className="lf-row">
              <label className="lf-remember"><input type="checkbox" /> Remember me</label>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
