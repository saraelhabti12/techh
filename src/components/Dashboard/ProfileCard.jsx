import React, { useState } from 'react';
import { useAuth } from '../../App'; // Assuming useAuth provides user data
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfileCard = () => {
    const { user, updateUserProfile } = useAuth(); // Assuming updateUserProfile is available in useAuth

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [company, setCompany] = useState(user?.company || '');

    const handleSave = async () => {
        // Here you would typically make an API call to update the user profile
        // For now, we'll just update the local state via a placeholder context function
        try {
            // await updateUserProfile({ name, email, phone, company }); // Example API call
            alert('Profile updated successfully! (Not truly persisted)');
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile.');
            console.error('Profile update error:', error);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone || '');
        setCompany(user?.company || '');
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div>
                <p>No user data available.</p>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h3>Your Profile</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                       
                    >
                        <FaEdit /> Edit Profile
                    </button>
                ) : (
                    <div>
                        <button
                            onClick={handleSave}
                           
                        >
                            <FaSave /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                           
                        >
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <div>
                <div>
                    <FaUserCircle />
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                           
                        />
                    ) : (
                        <p>{name}</p>
                    )}
                </div>

                <div>
                    <FaEnvelope />
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                           
                        />
                    ) : (
                        <p>{email}</p>
                    )}
                </div>

                <div>
                    <FaPhone />
                    {isEditing ? (
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                           
                        />
                    ) : (
                        <p>{phone || 'N/A'}</p>
                    )}
                </div>

                <div>
                    <FaBuilding />
                    {isEditing ? (
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                           
                        />
                    ) : (
                        <p>{company || 'N/A'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
