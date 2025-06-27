import { useState, useEffect } from 'react';
import { useAuth } from './auth';
import {
  getUserTokens,
  getTokenBalance,
  addTokens,
  consumeTokens,
} from '@/lib/tokens';
import { TokenRow } from '@/types/db';

export function useTokens() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getUserTokens(user.id);
      if (response.success) {
        setTokens(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch tokens');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!user?.id) return;

    try {
      const response = await getTokenBalance(user.id);
      if (response.success) {
        setBalance(response.data || 0);
      } else {
        setError(response.error || 'Failed to fetch balance');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const purchaseTokens = async (amount: number) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const response = await addTokens(amount);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add tokens');
    }

    // Refresh tokens and balance
    await Promise.all([fetchTokens(), fetchBalance()]);
    return response.data;
  };

  const consumeTokensFromHook = async (amount: number) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const response = await consumeTokens(user.id, amount);
    if (!response.success) {
      throw new Error(response.error || 'Failed to use tokens');
    }

    // Refresh tokens and balance
    await Promise.all([fetchTokens(), fetchBalance()]);
    return response.data;
  };

  useEffect(() => {
    if (user?.id) {
      Promise.all([fetchTokens(), fetchBalance()]);
    } else {
      setTokens([]);
      setBalance(0);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    tokens,
    balance,
    loading,
    error,
    purchaseTokens,
    consumeTokens: consumeTokensFromHook,
    refresh: () => Promise.all([fetchTokens(), fetchBalance()]),
  };
} 