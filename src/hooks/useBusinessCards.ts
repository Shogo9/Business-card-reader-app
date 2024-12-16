import { useState, useEffect, useCallback } from 'react';
import { BusinessCard } from '../types/BusinessCard';
import { getAllBusinessCards, searchBusinessCards } from '../db/database';

export function useBusinessCards() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCards = useCallback(async (query: string = '') => {
    try {
      setLoading(true);
      const fetchedCards = query
        ? await searchBusinessCards(query)
        : await getAllBusinessCards();
      setCards(fetchedCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load cards'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      loadCards(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, loadCards]);

  return {
    cards,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refreshCards: () => loadCards()
  };
}