import React, { useState } from 'react';
import { useAuth } from '../../App';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfileCard = () => {
    const { user } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [company, setCompany] = useState(user?.company || '');

    const handleSave = async () => {
        try {
            // Placeholder for API call
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile.');
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone || '');
        setCompany(user?.company || '');
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="profile-container animate-fadeUp">
            <div className="profile-card">
                <div className="profile-avatar">
                    <FaUserCircle />
                </div>
                <div className="profile-info">
                    <h3>{name}</h3>
                    <p>{email}</p>
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
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="field-input" />
                        ) : (
                            <span className="profile-value">{name}</span>
                        )}
                    </div>

                    <div className="profile-field-group">
                        <span className="profile-label">Email Address</span>
                        {isEditing ? (
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
                        ) : (
                            <span className="profile-value"><FaEnvelope /> {email}</span>
                        )}
                    </div>

                    <div className="profile-field-group">
                        <span className="profile-label">Phone Number</span>
                        {isEditing ? (
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" placeholder="+212 ..." />
                        ) : (
                            <span className="profile-value"><FaPhone /> {phone || 'Not provided'}</span>
                        )}
                    </div>

                    <div className="profile-field-group">
                        <span className="profile-label">Company / Organization</span>
                        {isEditing ? (
                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="field-input" />
                        ) : (
                            <span className="profile-value"><FaBuilding /> {company || 'Independent Creative'}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={handleSave} className="btn btn-primary btn-md">
                            <FaSave /> Save Changes
                        </button>
                        <button onClick={handleCancel} className="btn btn-ghost btn-md">
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
