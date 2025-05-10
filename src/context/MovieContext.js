import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lastSearches, setLastSearches] = useState(() => {
    try {
      const storedSearches = localStorage.getItem('lastSearches');
      return storedSearches ? JSON.parse(storedSearches) : [];
    } catch (error) {
      console.error('Failed to parse lastSearches from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFavorites(userDoc.data().favorites || []);
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lastSearches', JSON.stringify(lastSearches));
    } catch (error) {
      console.error('Failed to save lastSearches to localStorage:', error);
    }
  }, [lastSearches]);

  const setLastSearch = (query) => {
    if (!query.trim()) return;
    setLastSearches((prev) => {
      // Remove duplicates and limit to 5 recent searches
      const newSearches = [query, ...prev.filter((q) => q !== query)].slice(0, 5);
      return newSearches;
    });
  };

  const addFavorite = async (movie) => {
    if (!user) return;
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { favorites: newFavorites }, { merge: true });
  };

  const removeFavorite = async (movieId) => {
    if (!user) return;
    const newFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(newFavorites);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { favorites: newFavorites }, { merge: true });
  };

  return (
    <MovieContext.Provider
      value={{
        user,
        favorites,
        addFavorite,
        removeFavorite,
        lastSearches,
        setLastSearch,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};