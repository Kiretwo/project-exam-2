import React from 'react';
import { useParams } from 'react-router-dom';

const VenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Example of getting route param

  return (
    <div>
      <h1>Venue Details Page</h1>
      <p>Details for Venue ID: {id}</p>
      {/* Venue details, calendar, booking form will go here */}
    </div>
  );
};

export default VenuePage;