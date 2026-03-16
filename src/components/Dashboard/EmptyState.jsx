import React from 'react';
import { FaInbox } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, description, buttonText, buttonLink, icon: Icon = FaInbox }) => {
    return (
        <div>
            <Icon />
            <h3>{message}</h3>
            {description && <p>{description}</p>}
            {buttonText && buttonLink && (
                <Link
                    to={buttonLink}
                   
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
