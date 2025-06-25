import { useState, useEffect } from 'react';
import { revenueCatService, TokenPackage, SubscriptionInfo } from '@/lib/revenuecat';
import { useAuth } from './auth';

export interface RevenueCatState {
  packages: TokenPackage[];
  loading: boolean;
  error: string | null;
  subscriptionInfo: SubscriptionInfo;
  initialized: boolean;
}

export function useRevenueCat() {
  const { user } = useAuth();
  const [state, setState] = useState<RevenueCatState>({
    packages: [],
    loading: true,
    error: null,
    subscriptionInfo: { isActive: false },
    initialized: false,
  });

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Initialize RevenueCat with user ID
        await revenueCatService.initialize(user?.id);
        
        // Get available packages
        const packages = await revenueCatService.getOfferings();
        
        // Get subscription info
        const subscriptionInfo = await revenueCatService.getSubscriptionInfo();
        
        setState(prev => ({
          ...prev,
          packages,
          subscriptionInfo,
          loading: false,
          initialized: true,
        }));
      } catch (error: any) {
        console.error('Failed to initialize RevenueCat:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to initialize payment system',
          loading: false,
        }));
      }
    };

    if (user) {
      initializeRevenueCat();
    }
  }, [user]);

  const purchasePackage = async (packageToPurchase: TokenPackage) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await revenueCatService.purchasePackage(packageToPurchase);
      
      if (result.success) {
        // Refresh subscription info after successful purchase
        const subscriptionInfo = await revenueCatService.getSubscriptionInfo();
        setState(prev => ({
          ...prev,
          subscriptionInfo,
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Purchase failed',
          loading: false,
        }));
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Purchase failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const restorePurchases = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await revenueCatService.restorePurchases();
      
      if (result.success) {
        // Refresh subscription info after restore
        const subscriptionInfo = await revenueCatService.getSubscriptionInfo();
        setState(prev => ({
          ...prev,
          subscriptionInfo,
          loading: false,
        }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Failed to restore purchases',
          loading: false,
        }));
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to restore purchases';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...state,
    purchasePackage,
    restorePurchases,
  };
}