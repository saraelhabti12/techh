// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../App';
import '../styles/globals.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await register(name, email, password, passwordConfirmation);
            if (response.access_token) {
                 loginUser(response.access_token, response.user);
            }
            navigate('/dashboard'); 
        } catch (err) {
            if (err.response && err.response.status === 422 && err.response.data.errors) {
                setValidationErrors(err.response.data.errors);
                setError(err.response.data.message || 'Validation failed');
            } else {
                setError(err.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '2rem 1rem' }}>
            <div className="card" style={{
                display: 'flex',
                flexDirection: 'row',
                width: "100%",
                maxWidth: "1000px",
                minHeight: "550px",
                overflow: 'hidden',
                border: "1px solid var(--gray-200)"
            }}>
                <div className="auth-brand-panel" style={{
                    flex: '1',
                    background: 'var(--grad-hero)',
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRight: '1px solid var(--gray-200)'
                }}>
                    <div style={{ marginBottom: 'auto' }}>
                        <Link to="/" className="nav-logo-text" style={{ fontSize: '1.8rem', textDecoration: 'none' }}>
                            <img 
                                src="https://chatgpt.com/backend-api/estuary/content?id=file_0000000004807246b759bff43c95eaf4&ts=492758&p=fs&cid=1&sig=bad48e32482ca41ad3b70fc7d5e7921499a305dab5b54b19ea5333074e69d060&v=0" 
                                alt="TechStudio Logo" 
                                style={{ height: '55px', width: 'auto', objectFit: 'contain' }} 
                            />
                        </Link>
                    </div>
                    <div>
                        <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Join Us Today</h2>
                        <p className="body-md">Create an account to book your studio time, manage your projects, and bring your ideas to life.</p>
                    </div>
                </div>

                <div style={{ flex: '1.2', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Create an Account</h2>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Fill in your details to get started.</p>
                    </div>

                    {(error || Object.keys(validationErrors).length > 0) && (
                        <div style={{
                            background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--r-sm)',
                            marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #f87171'
                        }}>
                            {error}
                            {Object.keys(validationErrors).map((key) => (
                                <p key={key}>{validationErrors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="field">
                            <label className="field-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="field-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                            {validationErrors.name && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.name[0]}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="field-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                            {validationErrors.email && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.email[0]}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div className="field" style={{ flex: '1', minWidth: '200px' }}>
                                <label className="field-label" htmlFor="password">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="field-input"
                                        style={{ paddingRight: '3.5rem' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', color: 'var(--gray-500)', fontSize: '0.75rem', 
                                            fontWeight: '700', cursor: 'pointer', padding: '0.2rem'
                                        }}
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                                {validationErrors.password && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.password[0]}</p>}
                            </div>
                            <div className="field" style={{ flex: '1', minWidth: '200px' }}>
                                <label className="field-label" htmlFor="password_confirmation">Confirm</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password_confirmation"
                                    className="field-input"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                {validationErrors.password_confirmation && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.password_confirmation[0]}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--pink-500)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .auth-brand-panel { display: none !important; }
                }
            `}</style>
        </section>
    );
};

export default Register;
