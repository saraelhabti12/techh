import React, { useState, useEffect } from 'react';
import { FaHeart, FaCalendarPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';

const FavoriteStudios = () => {
    const navigate = useNavigate();
    const [favoriteStudios, setFavoriteStudios] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteStudios')) || [];
        if (storedFavorites.length === 0) {
            const mockFavorites = [
                {
                    id: 1,
                    name: 'The White Loft',
                    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=75',
                    location: 'Downtown Tangier',
                },
                {
                    id: 2,
                    name: 'Urban Soundstage',
                    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=75',
                    location: 'Malabata District',
                },
            ];
            setFavoriteStudios(mockFavorites);
        } else {
            setFavoriteStudios(storedFavorites);
        }
    }, []);

    return (
        <section style={{ marginBottom: '3.5rem' }}>
            <div className="section-title">
                <h3>Favorite Studios</h3>
            </div>
            
            {favoriteStudios.length === 0 ? (
                <EmptyState
                    message="No favorites yet"
                    description="Tap the heart icon on any studio to save it here for quick access."
                    buttonText="Explore Studios"
                    buttonLink="/"
                    icon={FaHeart}
                />
            ) : (
                <div className="favorites-grid">
                    {favoriteStudios.map((studio) => (
                        <div key={studio.id} className="studio-card animate-fadeUp">
                            <div className="studio-card-img-wrapper" style={{ height: '180px' }}>
                                <img src={studio.image} alt={studio.name} className="studio-card-img" />
                            </div>
                            <div className="studio-card-content">
                                <h4 className="studio-card-title">{studio.name}</h4>
                                <p className="studio-card-tagline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FaMapMarkerAlt /> {studio.location}
                                </p>
                                <div className="studio-card-footer" style={{ borderTop: 'none', paddingTop: '0', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => navigate('/reserve-studio', { state: { preselectedStudio: studio.id } })}
                                        className="btn btn-primary btn-sm"
                                        style={{ width: '100%' }}
                                    >
                                        <FaCalendarPlus /> Book Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FavoriteStudios;
