'use client';

import Navbar from '@/components/Navbar'; // Assuming the Navbar is in this path
import { useState } from 'react';

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Here you could filter favorites based on the search term
    // or implement other search functionality as needed
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-secondary">
      <Navbar onSearch={handleSearch} />
      
      <div className="flex flex-col items-center justify-center flex-grow mt-8">
        <h1 className="text-3xl font-bold mb-4 text-primary">Favorites</h1>
        
        {searchTerm ? (
          <p>Searching for "{searchTerm}" in your favorites...</p>
        ) : (
          <p>Your favorite recipes will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;