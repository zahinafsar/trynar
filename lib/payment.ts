import { Package, Purchases } from "@revenuecat/purchases-js";

class Payment {
    purchases: Purchases;
    constructor(userId: string) {
        if (!process.env.NEXT_PUBLIC_REVENUECAT_API_KEY) throw new Error("RevenueCat API key is not set");
        this.purchases = Purchases.configure(process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || "", userId);
    }
}

export const payment = new Payment(process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || "").purchases;