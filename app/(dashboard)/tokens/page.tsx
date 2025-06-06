"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Coins } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  cardName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits." }),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in MM/YY format." }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
  paymentMethod: z.enum(["credit", "paypal", "crypto"]),
});

export default function TokensPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      paymentMethod: "credit",
    },
  });

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Payment successful",
      description: `You have purchased ${selectedPlan === "basic" ? "10" : selectedPlan === "pro" ? "50" : "100"} tokens.`,
    });
    
    setIsSubmitting(false);
    setIsPaymentOpen(false);
    
    // Refresh the page to show updated token count
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tokens</h2>
        <p className="text-muted-foreground">
          Purchase tokens to generate 3D models for your products
        </p>
      </div>
      
      <div className="flex items-center space-x-4 rounded-lg border p-4 bg-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-xl font-semibold">25 tokens available</div>
          <p className="text-sm text-muted-foreground">
            You can generate up to 25 3D models with standard quality
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        <Card className="relative overflow-hidden bg-card">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>For occasional 3D model creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$9.99</div>
            <div className="text-sm text-muted-foreground mt-1">10 tokens</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Generate 10 standard quality models
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                30 days validity
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Basic AR try-on support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSelectPlan("basic")} className="w-full">
              Buy Tokens
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="relative overflow-hidden border-primary bg-card">
          <div className="absolute right-4 top-4">
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Popular
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For regular 3D model creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$39.99</div>
            <div className="text-sm text-muted-foreground mt-1">50 tokens</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Generate 50 standard quality models
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                60 days validity
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Advanced AR try-on support
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                High quality option available
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSelectPlan("pro")} className="w-full">
              Buy Tokens
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="relative overflow-hidden bg-card">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>For high-volume 3D model creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$69.99</div>
            <div className="text-sm text-muted-foreground mt-1">100 tokens</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Generate 100 standard quality models
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                90 days validity
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Premium AR try-on support
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Ultra quality option available
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSelectPlan("business")} className="w-full">
              Buy Tokens
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>
              {selectedPlan === "basic" && "Purchase 10 tokens for $9.99"}
              {selectedPlan === "pro" && "Purchase 50 tokens for $39.99"}
              {selectedPlan === "business" && "Purchase 100 tokens for $69.99"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit" id="credit" />
                          <label htmlFor="credit" className="text-sm font-medium">
                            Credit Card
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <label htmlFor="paypal" className="text-sm font-medium">
                            PayPal
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="crypto" id="crypto" />
                          <label htmlFor="crypto" className="text-sm font-medium">
                            Crypto
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name on Card</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="expiry"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <TokenHistory />
    </div>
  );
}