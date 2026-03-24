import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminStudios, createAdminStudio, updateAdminStudio } from '../api/adminApi';
import { FaArrowLeft, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

const AdminStudioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "", tagline: "", description: "", price_per_hour: "", 
        image: "", features: [], rating: 4.5
    });
    const [featureInput, setFeatureInput] = useState("");

    useEffect(() => {
        if (id) {
            getAdminStudios().then(res => {
                const studios = res.data?.data || res.data || res;
                const studio = studios.find(s => s.id === parseInt(id));
                if (studio) {
                    setFormData({
                        ...studio,
                        features: studio.features || []
                    });
                }
                setLoading(false);
            }).catch(() => {
                setLoading(false);
                alert("Failed to load studio details");
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (id) {
                await updateAdminStudio(id, formData);
            } else {
                await createAdminStudio(formData);
            }
            navigate('/admin/dashboard/studios');
        } catch (err) {
            alert("Failed to save studio");
        } finally {
            setSaving(false);
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
            setFeatureInput("");
        }
    };

    const removeFeature = (idx) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(idx, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span className="spinner spinner-purple" />
            <p style={{ marginTop: '1rem' }}>Loading studio data...</p>
        </div>
    );

    return (
        <div className="animate-fadeUp" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/admin/dashboard/studios')}
                className="btn btn-ghost"
                style={{ marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Studios
            </button>

            <div style={{ 
                background: '#fff', 
                borderRadius: '24px', 
                padding: '3rem', 
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--gray-100)'
            }}>
                <h2 className="heading-lg" style={{ marginBottom: '2.5rem' }}>
                    {id ? "Edit Studio" : "Add New Studio"}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="field">
                            <label className="field-label">Studio Name</label>
                            <input className="field-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Neon Horizon" />
                        </div>
                        <div className="field">
                            <label className="field-label">Price per Hour (MAD)</label>
                            <input className="field-input" type="number" required value={formData.price_per_hour} onChange={e => setFormData({...formData, price_per_hour: e.target.value})} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label">Tagline</label>
                        <input className="field-input" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Modern vibes for your next shoot" />
                    </div>

                    <div className="field">
                        <label className="field-label">Description</label>
                        <textarea className="field-input" rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your studio..." />
                    </div>

                    <div className="field">
                        <label className="field-label">Main Image URL</label>
                        <div style={{ position: 'relative' }}>
                            <input className="field-input" style={{ paddingLeft: '2.8rem' }} required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                            <FaCloudUploadAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label">Features & Amenities</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input 
                                className="field-input" 
                                style={{ flex: 1 }} 
                                value={featureInput} 
                                onChange={e => setFeatureInput(e.target.value)} 
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                placeholder="e.g. RGB Lighting, Cyclorama wall..." 
                            />
                            <button type="button" className="btn btn-primary btn-md" onClick={addFeature}>Add</button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
                            {(formData.features || []).map((f, i) => (
                                <span key={i} className="tag tag-pink" style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                    {f} 
                                    <FaTrash 
                                        style={{ marginLeft: '0.5rem', cursor: 'pointer', opacity: 0.6 }} 
                                        onClick={() => removeFeature(i)} 
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", paddingTop: '2rem', borderTop: '1px solid var(--gray-100)' }}>
                        <button type="button" className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={() => navigate('/admin/dashboard/studios')}>Cancel</button>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={saving}>
                            {saving ? "Saving Changes..." : id ? "Update Studio" : "Create Studio"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminStudioForm;
