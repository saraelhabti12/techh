import React, { useState } from 'react';
import Modal from './Modal';
import { login, register } from '../api/authApi';
import { useAuth } from '../App';
import { useTranslation } from 'react-i18next';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { t } = useTranslation();
  const { loginUser } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      if (mode === 'login') {
        const data = await login(formData.email, formData.password);
        loginUser(data.access_token, data.user);
        onClose();
      } else {
        const data = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        );
        loginUser(data.access_token, data.user);
        onClose();
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An error occurred");
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        }
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setFieldErrors({});
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'login' ? "Welcome Back" : "Create Account"}
      maxWidth="450px"
    >
      <div className="auth-modal-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {mode === 'signup' && (
            <div className="field">
              <label className="field-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="field-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {fieldErrors.name && <span className="error-text">{fieldErrors.name[0]}</span>}
            </div>
          )}

          <div className="field">
            <label className="field-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="field-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <span className="error-text">{fieldErrors.email[0]}</span>}
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              className="field-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && <span className="error-text">{fieldErrors.password[0]}</span>}
          </div>

          {mode === 'signup' && (
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                className="field-input"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && !Object.keys(fieldErrors).length && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              mode === 'login' ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          <p>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={toggleMode} className="btn-link">
              {mode === 'login' ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .auth-modal-content {
          padding: 0.5rem 0;
        }
        .auth-modal-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--gray-500);
        }
        .btn-link {
          background: none;
          border: none;
          color: var(--pink-500);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
        }
        .btn-link:hover {
          text-decoration: underline;
        }
        .error-text {
          color: var(--reserved);
          font-size: 0.75rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }
        .alert {
          padding: 0.75rem 1rem;
          border-radius: var(--r-sm);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .alert-danger {
          background: var(--reserved-bg);
          color: var(--reserved);
          border: 1px solid var(--reserved-border);
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};

export default AuthModal;
