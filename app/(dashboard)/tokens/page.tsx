"use client";

import { useState } from "react";
import {
  Check,
  CreditCard,
  Coins,
  AlertCircle,
  Crown,
  Zap,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TokenHistory } from "@/components/tokens/token-history";
import { useToast } from "@/hooks/use-toast";
import { usePayment } from "@/hooks/use-payment";
import { useTokens } from "@/hooks/use-tokens";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "@revenuecat/purchases-js";
import { formatTokenAmount } from "@/lib/utils";

export default function TokensPage() {
  const { toast } = useToast();
  const pay = usePayment();
  const {
    balance,
    loading: tokensLoading,
    error: tokensError,
    purchaseTokens,
  } = useTokens();

  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(
    null
  );

  const handlePurchase = async (pkg: Package) => {
    if (purchasingPackage) return;

    setPurchasingPackage(pkg.identifier);

    try {
      await pay.purchasePackage(pkg);

      // Add tokens to user's account after successful payment
      const tokenAmount = pkg.webBillingProduct.currentPrice.amountMicros
      await purchaseTokens(tokenAmount);

      toast({
        title: "Purchase successful!",
        description: `You have successfully purchased ${formatTokenAmount(
          tokenAmount
        )} tokens.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setPurchasingPackage(null);
    }
  };

  if (!pay.initialized && pay.loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tokens</h2>
          <p className="text-muted-foreground">
            Purchase tokens to generate 3D models for your products
          </p>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-lg font-medium">
              Initializing payment system...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pay.error && !pay.initialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tokens</h2>
          <p className="text-muted-foreground">
            Purchase tokens to generate 3D models for your products
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment System Error</AlertTitle>
          <AlertDescription>
            {pay.error}. Please refresh the page or contact support if the issue
            persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Convert packages to the format expected by the UI
  const packageList = Object.values(pay.packages?.all || {}).flatMap(
    (offering) => {
      const plan = offering.availablePackages[0];
      const product = plan.webBillingProduct;
      return {
        id: product.identifier,
        product: {
          title: offering.identifier,
          description: product.description,
          priceString: product.currentPrice.formattedPrice,
        },
        tokens: product.currentPrice.amountMicros,
        popular: product.currentPrice.amountMicros === 50000000,
        package: plan,
      };
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tokens</h2>
        <p className="text-muted-foreground">
          Purchase tokens to generate 3D models for your products
        </p>
      </div>

      {/* Current Token Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 rounded-lg border p-4 bg-card"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold">
            {tokensLoading ? (
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            ) : (
              `${formatTokenAmount(balance)} tokens available`
            )}
          </div>
        </div>
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
          <Crown className="mr-1 h-3 w-3" />
          Active
        </Badge>
      </motion.div>

      {/* Error Display */}
      {(pay.error || tokensError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pay.error || tokensError}</AlertDescription>
        </Alert>
      )}

      {/* Token Packages */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        {packageList.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card
              className={`relative overflow-hidden bg-card ${
                pkg.popular ? "border-primary" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                </div>
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${
                  pkg.popular
                    ? "from-primary/10 to-transparent"
                    : index === 0
                    ? "from-blue-500/10 to-transparent"
                    : "from-purple-500/10 to-transparent"
                }`}
              />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  {pkg.product.title}
                  {pkg.popular && <Crown className="h-4 w-4 text-primary" />}
                </CardTitle>
                <CardDescription>{pkg.product.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold">
                  {pkg.product.priceString}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatTokenAmount(pkg.tokens)} tokens
                </div>
                <Separator className="my-4" />
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Generate {pkg.tokens / 100000} standard quality models
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Unlimited validity
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {pkg.tokens <= 10000000
                      ? "Basic"
                      : pkg.tokens <= 50000000
                      ? "Advanced"
                      : "Premium"}{" "}
                    AR try-on support
                  </li>
                  {pkg.tokens > 10 && (
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      High quality option available
                    </li>
                  )}
                  <li className={`flex items-center`}>
                    {pkg.tokens > 50000000 ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    Ultra quality option available
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative">
                <Button
                  onClick={() => handlePurchase(pkg.package)}
                  className="w-full"
                  disabled={
                    pay.loading || purchasingPackage === pkg.id || tokensLoading
                  }
                  variant={pkg.popular ? "default" : "outline"}
                >
                  {purchasingPackage === pkg.id && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {purchasingPackage === pkg.id
                    ? "Processing..."
                    : "Purchase Tokens"}
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <TokenHistory />
    </div>
  );
}
