import React, { useState, useEffect } from 'react';
import { FaHeart, FaCalendarPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EmptyState from './EmptyState';

const FavoriteStudios = () => {
    // In a real application, this would come from a user API or a dedicated favorites API
    const [favoriteStudios, setFavoriteStudios] = useState([]);

    useEffect(() => {
        // Simulate fetching favorite studios from local storage or a mock API
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteStudios')) || [];
        if (storedFavorites.length === 0) {
            // Add some mock data if no favorites are stored
            const mockFavorites = [
                {
                    id: 'studio-1',
                    name: 'Creative Hub Studio',
                    image: 'https://via.placeholder.com/300x200?text=Creative+Hub', // Placeholder image
                    location: 'Downtown',
                },
                {
                    id: 'studio-2',
                    name: 'Sound Wave Studio',
                    image: 'https://via.placeholder.com/300x200?text=Sound+Wave', // Placeholder image
                    location: 'Midtown',
                },
            ];
            setFavoriteStudios(mockFavorites);
            localStorage.setItem('favoriteStudios', JSON.stringify(mockFavorites));
        } else {
            setFavoriteStudios(storedFavorites);
        }
    }, []);

    const handleBookAgain = (studioId) => {
        // This would navigate to the studio's booking page
        alert(`Navigating to book studio: ${studioId}`);
        // Example: navigate(`/studios/${studioId}/book`);
    };

    return (
        <div>
            <h3>Your Favorite Studios</h3>
            {favoriteStudios.length === 0 ? (
                <EmptyState
                    message="You haven't favorited any studios yet."
                    description="Browse our studios and add your favorites to quickly book them later!"
                    buttonText="Browse Studios"
                    buttonLink="/studios"
                    icon={FaHeart}
                />
            ) : (
                <div>
                    {favoriteStudios.map((studio) => (
                        <div key={studio.id}>
                            <img src={studio.image} alt={studio.name} />
                            <div>
                                <h4>{studio.name}</h4>
                                <p>{studio.location}</p>
                                <button
                                    onClick={() => handleBookAgain(studio.id)}
                                   
                                >
                                    <FaCalendarPlus /> Book Again
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteStudios;
