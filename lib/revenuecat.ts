import Purchases, { PurchasesOffering, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-js';

// RevenueCat configuration
const REVENUECAT_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || 'your_revenuecat_api_key';

export interface TokenPackage {
  id: string;
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
  tokens: number;
  popular?: boolean;
}

export interface SubscriptionInfo {
  isActive: boolean;
  productIdentifier?: string;
  expirationDate?: string;
  willRenew?: boolean;
}

class RevenueCatService {
  private initialized = false;

  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserId: userId,
      });
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<TokenPackage[]> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        console.warn('No current offering found');
        return this.getFallbackPackages();
      }

      return this.mapPackagesToTokenPackages(currentOffering.availablePackages);
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return this.getFallbackPackages();
    }
  }

  private mapPackagesToTokenPackages(packages: PurchasesPackage[]): TokenPackage[] {
    return packages.map((pkg, index) => {
      // Map package identifiers to token amounts
      const tokenMapping: Record<string, { tokens: number; popular?: boolean }> = {
        'basic_tokens': { tokens: 10 },
        'pro_tokens': { tokens: 50, popular: true },
        'business_tokens': { tokens: 100 },
        'starter_tokens': { tokens: 5 },
        'premium_tokens': { tokens: 200 },
      };

      const tokenInfo = tokenMapping[pkg.identifier] || { tokens: 10 };

      return {
        id: pkg.identifier,
        identifier: pkg.identifier,
        packageType: pkg.packageType,
        product: {
          identifier: pkg.product.identifier,
          description: pkg.product.description,
          title: pkg.product.title,
          price: pkg.product.price,
          priceString: pkg.product.priceString,
          currencyCode: pkg.product.currencyCode,
        },
        tokens: tokenInfo.tokens,
        popular: tokenInfo.popular,
      };
    });
  }

  private getFallbackPackages(): TokenPackage[] {
    return [
      {
        id: 'basic_tokens',
        identifier: 'basic_tokens',
        packageType: 'CUSTOM',
        product: {
          identifier: 'basic_tokens',
          description: 'Basic token package for occasional 3D model creation',
          title: 'Basic Tokens',
          price: 9.99,
          priceString: '$9.99',
          currencyCode: 'USD',
        },
        tokens: 10,
      },
      {
        id: 'pro_tokens',
        identifier: 'pro_tokens',
        packageType: 'CUSTOM',
        product: {
          identifier: 'pro_tokens',
          description: 'Pro token package for regular 3D model creation',
          title: 'Pro Tokens',
          price: 39.99,
          priceString: '$39.99',
          currencyCode: 'USD',
        },
        tokens: 50,
        popular: true,
      },
      {
        id: 'business_tokens',
        identifier: 'business_tokens',
        packageType: 'CUSTOM',
        product: {
          identifier: 'business_tokens',
          description: 'Business token package for high-volume 3D model creation',
          title: 'Business Tokens',
          price: 69.99,
          priceString: '$69.99',
          currencyCode: 'USD',
        },
        tokens: 100,
      },
    ];
  }

  async purchasePackage(packageToPurchase: TokenPackage): Promise<{ success: boolean; error?: string; customerInfo?: CustomerInfo }> {
    try {
      if (!this.initialized) {
        throw new Error('RevenueCat not initialized');
      }

      // For web implementation, we'll simulate the purchase
      // In a real app, this would trigger the actual purchase flow
      console.log('Initiating purchase for package:', packageToPurchase.identifier);
      
      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      // For demo purposes, we'll return a success response
      const mockCustomerInfo = {
        originalAppUserId: 'user_123',
        allPurchaseDates: {},
        firstSeen: new Date().toISOString(),
        originalApplicationVersion: '1.0.0',
        requestDate: new Date().toISOString(),
        latestExpirationDate: null,
        originalPurchaseDate: null,
        managementURL: null,
        entitlements: {
          active: {},
          all: {},
        },
        activeSubscriptions: [],
        allPurchasedProductIdentifiers: [packageToPurchase.product.identifier],
        nonSubscriptionTransactions: [
          {
            productIdentifier: packageToPurchase.product.identifier,
            purchaseDate: new Date().toISOString(),
            transactionIdentifier: `txn_${Date.now()}`,
          }
        ],
        allExpirationDates: {},
      } as CustomerInfo;

      return {
        success: true,
        customerInfo: mockCustomerInfo,
      };
    } catch (error: any) {
      console.error('Purchase failed:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<{ success: boolean; error?: string; customerInfo?: CustomerInfo }> {
    try {
      if (!this.initialized) {
        throw new Error('RevenueCat not initialized');
      }

      const customerInfo = await Purchases.restorePurchases();
      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Restore purchases failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore purchases',
      };
    }
  }

  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (!customerInfo) {
        return { isActive: false };
      }

      const activeEntitlements = Object.keys(customerInfo.entitlements.active);
      const hasActiveSubscription = activeEntitlements.length > 0;

      if (hasActiveSubscription) {
        const firstEntitlement = customerInfo.entitlements.active[activeEntitlements[0]];
        return {
          isActive: true,
          productIdentifier: firstEntitlement.productIdentifier,
          expirationDate: firstEntitlement.expirationDate,
          willRenew: firstEntitlement.willRenew,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error('Failed to get subscription info:', error);
      return { isActive: false };
    }
  }
}

export const revenueCatService = new RevenueCatService();