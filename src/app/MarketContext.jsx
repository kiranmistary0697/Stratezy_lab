// MarketContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const MarketContext = createContext();

// Create the provider component
export const MarketProvider = ({ children }) => {
  const [selectedMarket, setSelectedMarket] = useState('India');

  // Helper function to map market to exchange code
  const getExchange = () => {
    return selectedMarket === 'India'
      ? 'nse'
      : selectedMarket === 'US'
      ? 'nasdaq'
      : '';
  };

  return (
    <MarketContext.Provider value={{ selectedMarket, setSelectedMarket, getExchange }}>
      {children}
    </MarketContext.Provider>
  );
};

// Custom hook for easier consumption
export const useMarket = () => useContext(MarketContext);
    