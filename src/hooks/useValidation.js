import { useState } from 'react';

/**
 * useValidation — shared real-time form validation hook.
 * Pass a rules object: { fieldName: [{ test: fn, msg: string }] }
 */
export function useValidation(rules) {
  const [errors, setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const fieldRules = rules[name] || [];
    for (const rule of fieldRules) {
      if (!rule.test(value)) {
        setErrors(e => ({ ...e, [name]: rule.msg }));
        return false;
      }
    }
    setErrors(e => { const n = { ...e }; delete n[name]; return n; });
    return true;
  };

  const touch = (name, value) => {
    setTouched(t => ({ ...t, [name]: true }));
    validate(name, value);
  };

  const validateAll = (formData) => {
    let valid = true;
    const allTouched = {};
    Object.keys(rules).forEach(name => {
      allTouched[name] = true;
      if (!validate(name, formData[name] ?? '')) valid = false;
    });
    setTouched(allTouched);
    return valid;
  };

  const reset = () => { setErrors({}); setTouched({}); };

  return { errors, touched, touch, validateAll, reset };
}

// ── Shared rule factories ─────────────────────────────────────────
export const rules = {
  required: (label = 'This field') => ({
    test: v => v && v.trim().length > 0,
    msg: `${label} is required.`,
  }),
  minLen: (n, label = 'This field') => ({
    test: v => v && v.trim().length >= n,
    msg: `${label} must be at least ${n} characters.`,
  }),
  maxLen: (n, label = 'This field') => ({
    test: v => !v || v.trim().length <= n,
    msg: `${label} must not exceed ${n} characters.`,
  }),
  email: () => ({
    test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    msg: 'Please enter a valid email address.',
  }),
  phone: () => ({
    test: v => !v || /^\+?[\d\s\-()]{7,15}$/.test(v),
    msg: 'Please enter a valid phone number.',
  }),
  password: () => ({
    test: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v),
    msg: 'Password: 8+ chars, uppercase, lowercase and number.',
  }),
  matchField: (otherVal, label = 'Passwords') => ({
    test: v => v === otherVal,
    msg: `${label} do not match.`,
  }),
  positiveNum: (label = 'Value') => ({
    test: v => !isNaN(v) && Number(v) >= 0,
    msg: `${label} must be a positive number.`,
  }),
};
