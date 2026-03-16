import React from 'react';
import { useParams } from 'react-router-dom';

export default function StudioPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Studio Details for Studio ID: {id}</h2>
      <p>Activities and previous bookings for this studio will be displayed here.</p>
    </div>
  );
}