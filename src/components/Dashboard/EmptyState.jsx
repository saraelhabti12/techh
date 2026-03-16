import React from 'react';
import { FaInbox } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, description, buttonText, buttonLink, icon: Icon = FaInbox }) => {
    return (
        <div className="empty-state animate-fadeUp">
            <div className="empty-state-icon">
                <Icon />
            </div>
            <h4>{message}</h4>
            {description && <p>{description}</p>}
            {buttonText && buttonLink && (
                <Link
                    to={buttonLink}
                    className="btn btn-primary btn-md"
                    style={{ marginTop: '0.5rem' }}
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
