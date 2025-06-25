"use client";

import { useState } from "react";
import { CreditCard, X, Shield, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TokenPackage } from "@/lib/revenuecat";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: TokenPackage | null;
  onPurchase: (pkg: TokenPackage) => Promise<void>;
  isLoading: boolean;
}

export function PurchaseModal({
  isOpen,
  onClose,
  package: selectedPackage,
  onPurchase,
  isLoading,
}: PurchaseModalProps) {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setStep('processing');
    try {
      await onPurchase(selectedPackage);
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('confirm');
      }, 2000);
    } catch (error) {
      setStep('confirm');
    }
  };

  if (!selectedPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Purchase
          </DialogTitle>
          <DialogDescription>
            Review your token package purchase
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Package Details */}
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{selectedPackage.product.title}</h3>
                  {selectedPackage.popular && (
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedPackage.product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{selectedPackage.product.priceString}</span>
                  <span className="text-lg font-medium">{selectedPackage.tokens} tokens</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-medium">What's included:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Generate {selectedPackage.tokens} 3D models
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    AR try-on capability
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    High-quality model generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    90-day token validity
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Secure Payment</p>
                  <p className="text-blue-600 dark:text-blue-400">
                    Your payment is processed securely through RevenueCat
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handlePurchase} disabled={isLoading} className="flex-1">
                  {isLoading ? "Processing..." : `Purchase ${selectedPackage.product.priceString}`}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Processing Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your purchase...
                </p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Purchase Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedPackage.tokens} tokens have been added to your account
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}