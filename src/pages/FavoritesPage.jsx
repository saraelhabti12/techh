import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../App';
import StudioCard from '../components/StudioCard';
import { FiHeart } from 'react-icons/fi';

const FavoritesPage = ({ openBook }) => {
    const { favorites, fetchFavorites } = useFavorites();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
        window.scrollTo(0, 0);
    }, [fetchFavorites]);

    return (
        <div className="favorites-page" style={{ padding: '4rem 2rem', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="font-display" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Your Favorites</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>All the spaces you love, in one place.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-favorites" style={{ 
                    textAlign: 'center', 
                    padding: '5rem 2rem', 
                    background: 'var(--white)', 
                    borderRadius: '24px', 
                    border: '1.5px dashed var(--gray-200)',
                    marginTop: '2rem'
                }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'var(--pink-50)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 2rem',
                        color: 'var(--pink-500)'
                    }}>
                        <FiHeart size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>You have no favorites yet</h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                        Start exploring our studios and save your favorite ones to find them easily later.
                    </p>
                    <button 
                        className="btn btn-primary btn-lg" 
                        onClick={() => navigate('/')}
                    >
                        Explore Studios
                    </button>
                </div>
            ) : (
                <div className="favorites-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '2.5rem',
                    justifyContent: 'center'
                }}>
                    {favorites.map((studio, index) => (
                        <StudioCard 
                            key={studio.id} 
                            studio={studio} 
                            onBook={() => openBook(studio)}
                            onDetail={() => navigate(`/studio/${studio.id}`)}
                            delay={index * 100}
                        />
                    ))}
                </div>
            )}

            <style>{`
                .favorites-page {
                    animation: fadeIn 0.5s var(--ease);
                }
                @media (max-width: 768px) {
                    .favorites-page { padding: 2rem 1rem !important; }
                    .section-header h1 { font-size: 2.25rem !important; }
                }
            `}</style>
        </div>
    );
};

export default FavoritesPage;
