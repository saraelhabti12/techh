// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../App';
import '../styles/globals.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useAuth(); // Import loginUser from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            loginUser(data.access_token, data.user); // Update auth context
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '2rem 1rem' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                background: "var(--white)",
                borderRadius: "var(--r-xl)",
                width: "100%",
                maxWidth: "900px",
                minHeight: "500px",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--gray-200)",
                overflow: 'hidden'
            }}>
                {/* Left Brand Panel - hide on small screens */}
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
                        <Link to="/" className="nav-logo-text" style={{ fontSize: '1.8rem' }}>
                            <span className="nav-logo-icon" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>✦</span>
                            Tech<em style={{ fontStyle: "italic", color: "var(--pink-500)", paddingRight: "0.2rem" }}>Studio</em>
                        </Link>
                    </div>
                    <div>
                        <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Welcome Back</h2>
                        <p className="body-md">Log in to manage your reservations, explore exclusive offers, and book your next creative session seamlessly.</p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div style={{ flex: '1', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Sign In</h2>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Enter your details below to continue.</p>
                    </div>
                    
                    {error && (
                        <div style={{
                            background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--r-sm)',
                            marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #f87171'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                        </div>
                        <div className="field">
                            <label className="field-label" htmlFor="password">Password</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="field-input"
                                    style={{ width: '100%', paddingRight: '3.5rem' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', background: 'none', border: 'none',
                                        color: 'var(--gray-500)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
                                        padding: '0.2rem'
                                    }}
                                >
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--pink-500)', fontWeight: 600, textDecoration: 'none' }}>
                                Register here
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

export default Login;