import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import { useFavorites } from '../../App';
import StudioCard from '../StudioCard';
import Modal from '../Modal';
import { useTranslation } from 'react-i18next';

const FavoriteStudios = () => {
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const { t } = useTranslation();
    const [detail, setDetail] = useState(null);
    const [imgIdx, setImgIdx] = useState(0);

    const handleBook = (studio) => {
        navigate('/', { state: { openReservation: true, preselectedStudio: studio } });
    };

    return (
        <section style={{ marginBottom: '3.5rem' }}>
            <div className="section-title">
                <h3>Favorite Studios</h3>
            </div>
            
            {favorites.length === 0 ? (
                <EmptyState
                    message="No favorites yet"
                    description="Tap the heart icon on any studio to save it here for quick access."
                    buttonText="Explore Studios"
                    buttonLink="/"
                    icon={FaHeart}
                />
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "24px",
                }}>
                    {favorites.map((studio, i) => (
                        <StudioCard
                            key={studio.id}
                            studio={studio}
                            onBook={() => handleBook(studio)}
                            onDetail={(s) => { setDetail(s); setImgIdx(0); }}
                            delay={i * 50}
                        />
                    ))}
                </div>
            )}

            {/* ── Detail Modal ── */}
            <Modal isOpen={!!detail} onClose={() => setDetail(null)} maxWidth="850px">
                {detail && (
                <div className="animate-fadeIn">
                    <div style={{ position: "relative", height: 380, overflow: "hidden", borderRadius: "16px", marginBottom: "2rem" }}>
                    <img
                        src={detail.gallery?.[imgIdx] || detail.image}
                        alt={detail.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                    {detail.gallery?.length > 1 && (
                        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.6rem" }}>
                        {detail.gallery.map((_, i) => (
                            <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 28 : 10, height: 10, borderRadius: 50, background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
                        ))}
                        </div>
                    )}
                    <div style={{ position: "absolute", bottom: 30, left: 30 }}>
                        <h2 className="font-display" style={{ color: "#fff", marginBottom: "0.4rem", fontSize: "2.5rem", lineHeight: 1 }}>{detail.name}</h2>
                        <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{detail.tagline}</div>
                    </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div>
                        <span style={{ fontSize: "2rem", color: "var(--gray-900)", fontWeight: 800 }}>MAD {detail.price_per_hour}</span>
                        <span style={{ fontSize: "1rem", color: "var(--gray-500)", marginLeft: "0.4rem" }}>/ hour</span>
                        <span style={{ fontSize: "0.9rem", color: "var(--gray-200)", margin: "0 1.5rem" }}>|</span>
                        <span style={{ fontSize: "1rem", color: "var(--gray-600)", fontWeight: 500 }}>{t('min_session', { hours: detail.min_hours })}</span>
                    </div>
                    <span className="tag" style={{ background: 'var(--available-bg)', color: 'var(--available)', fontSize: "0.9rem", padding: "0.6rem 1.2rem", borderRadius: "12px", fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="dot" style={{ background: "var(--available)", width: 8, height: 8 }} /> {t('available_now')}
                    </span>
                    </div>
                    <div style={{ marginBottom: "2.5rem" }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '1rem', fontWeight: 800 }}>{t('about_this_space')}</h4>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--gray-700)", fontWeight: 400 }}>{detail.description}</p>
                    </div>
                    <div style={{ marginBottom: "3rem" }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '1.25rem', fontWeight: 800 }}>{t('included_amenities')}</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        {(detail.features || []).map(f => (
                        <span key={f} style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem", background: "var(--gray-50)", color: "var(--gray-700)", border: "1px solid var(--gray-100)", borderRadius: "12px", fontWeight: 600 }}>✓ {f}</span>
                        ))}
                    </div>
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem", paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                    <button className="btn btn-outline" style={{ flex: 1, height: "56px", borderRadius: "14px" }} onClick={() => setDetail(null)}>{t('close')}</button>
                    <button className="btn btn-primary" style={{ flex: 2, height: "56px", borderRadius: "14px", fontSize: "1.1rem" }} onClick={() => { setDetail(null); handleBook(detail); }}>{t('book_this_studio_now')} →</button>
                    </div>
                </div>
                )}
            </Modal>
        </section>
    );
};

export default FavoriteStudios;
