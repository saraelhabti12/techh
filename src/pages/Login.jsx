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
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            console.log('[Debug] Login successful, user object:', data.user);
            
            await loginUser(data.access_token, data.user);
            
            if (data.user.is_admin === true) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
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
                maxWidth: "900px",
                minHeight: "500px",
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
                        <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Welcome Back</h2>
                        <p className="body-md">Log in to manage your reservations, explore exclusive offers, and book your next creative session seamlessly.</p>
                    </div>
                </div>

                <div style={{ flex: '1', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)' }}>
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
                        </div>
                        
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '0.5rem' }}
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
