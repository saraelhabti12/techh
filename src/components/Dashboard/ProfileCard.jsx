import React, { useState } from 'react';
import { useAuth } from '../../App';
import { FaUserCircle, FaEnvelope, FaLock, FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { updateUser } from '../../api/authApi';

const ProfileCard = () => {
    const { user, setUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const userData = {
                name,
                email,
            };

            if (password) {
                userData.password = password;
                userData.password_confirmation = passwordConfirmation;
            }

            const response = await updateUser(userData);
            setUser(response.user);
            setIsEditing(false);
            setPassword('');
            setPasswordConfirmation('');
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPassword('');
        setPasswordConfirmation('');
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="profile-container animate-fadeUp">
            <div className="profile-card">
                <div className="profile-avatar">
                    <div style={{ position: 'relative' }}>
                        <FaUserCircle />
                        {isEditing && (
                            <button className="avatar-edit-btn" title="Change Avatar">
                                <FaCamera size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm">
                            <FaEdit /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div className="section-title">
                    <h4>Personal Information</h4>
                </div>

                <div className="profile-fields">
                    <div className="profile-field-group">
                        <span className="profile-label">Full Name</span>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="field-input" 
                                disabled={loading}
                            />
                        ) : (
                            <span className="profile-value">{user.name}</span>
                        )}
                    </div>

                    <div className="profile-field-group">
                        <span className="profile-label">Email Address</span>
                        {isEditing ? (
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="field-input" 
                                disabled={loading}
                            />
                        ) : (
                            <span className="profile-value"><FaEnvelope /> {user.email}</span>
                        )}
                    </div>

                    {isEditing && (
                        <>
                            <div className="profile-field-group">
                                <span className="profile-label">New Password (leave blank to keep current)</span>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="field-input" 
                                        style={{ paddingLeft: '2.8rem' }}
                                        placeholder="••••••••"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="profile-field-group">
                                <span className="profile-label">Confirm New Password</span>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                    <input 
                                        type="password" 
                                        value={passwordConfirmation} 
                                        onChange={(e) => setPasswordConfirmation(e.target.value)} 
                                        className="field-input" 
                                        style={{ paddingLeft: '2.8rem' }}
                                        placeholder="••••••••"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {isEditing && (
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={handleSave} 
                            className="btn btn-primary btn-md"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                        </button>
                        <button 
                            onClick={handleCancel} 
                            className="btn btn-ghost btn-md"
                            disabled={loading}
                        >
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .avatar-edit-btn {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: var(--pink-500);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-md);
                    transition: all 0.2s ease;
                }
                .avatar-edit-btn:hover {
                    background: var(--pink-600);
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default ProfileCard;
