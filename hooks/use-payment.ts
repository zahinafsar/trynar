import { useState, useEffect } from 'react';
import { useAuth } from './auth';
import { Offerings, Package } from '@revenuecat/purchases-js';
import { payment } from '@/lib/payment';

export interface PaymentState {
    packages: Offerings | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

export function usePayment() {
    const { user } = useAuth();
    const [state, setState] = useState<PaymentState>({
        packages: null,
        loading: true,
        error: null,
        initialized: false,
    });

    useEffect(() => {
        const initializeRevenueCat = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                const packages = await payment.getOfferings();
                setState(prev => ({
                    ...prev,
                    packages,
                    loading: false,
                    initialized: true,
                }));
            } catch (error: any) {
                console.error('Failed to initialize RevenueCat:', error);
            }
        };

        if (user) initializeRevenueCat();
    }, [user]);

    const purchasePackage = async (pkg: Package) => {
        const result = await payment.purchase({
            rcPackage: pkg,
        });
        console.log(result);
    };

    return {
        ...state,
        purchasePackage
    };
}