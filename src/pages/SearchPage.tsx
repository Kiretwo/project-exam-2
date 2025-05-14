import React from 'react';
import { useParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Example of getting route param

  return (
    <div>
      <h1>Search Page</h1>
      <p>Details for Venues {id}</p>
      {/* Venue details, calendar, booking form will go here */}
    </div>
  );
};

export default SearchPage;