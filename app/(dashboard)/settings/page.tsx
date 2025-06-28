"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  bio: z.string().max(500, { message: "Bio must be at most 500 characters." }).optional(),
});

const notificationsFormSchema = z.object({
  modelCompletionEmail: z.boolean(),
  modelCompletionPush: z.boolean(),
  tokenReminderEmail: z.boolean(),
  tokenReminderPush: z.boolean(),
  marketingEmail: z.boolean(),
});

const apiFormSchema = z.object({
  apiKey: z.string(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      company: "Acme Inc.",
      website: "https://example.com",
      bio: "Shop owner specializing in premium footwear and accessories.",
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      modelCompletionEmail: true,
      modelCompletionPush: true,
      tokenReminderEmail: true,
      tokenReminderPush: false,
      marketingEmail: false,
    },
  });

  const apiForm = useForm<z.infer<typeof apiFormSchema>>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      apiKey: "sk_test_3d_model_platform_api_key_123456789",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
    
    setIsSubmitting(false);
  }

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated.",
    });
    
    setIsSubmitting(false);
  }

  async function onApiSubmit(values: z.infer<typeof apiFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "API key regenerated",
      description: "Your API key has been regenerated.",
    });
    
    setIsSubmitting(false);
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    
    passwordForm.reset();
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Manage your account settings, preferences, and API configuration.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="billing"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Billing
          </TabsTrigger>
          <TabsTrigger 
            value="api"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your public profile information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FormProvider {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Company</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Your company or organization name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Website</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Your store or business website.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself or your business"
                            className="resize-none bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Brief description of you or your business.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Save Changes
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Change Password
              </CardTitle>
              <CardDescription className="text-gray-300">
                Update your account password for enhanced security.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-slate-800/50 border-purple-500/30 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    variant="outline" 
                    disabled={isSubmitting}
                    className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  >
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Update Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage how you receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FormProvider {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-white">3D Model Notifications</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="modelCompletionEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/20 p-4 bg-slate-800/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">
                                Email Notifications
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Receive emails when your 3D models are completed.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="modelCompletionPush"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/20 p-4 bg-slate-800/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">
                                Push Notifications
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Receive push notifications when your 3D models are completed.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-purple-500/20" />
                  
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-white">Token Reminders</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="tokenReminderEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/20 p-4 bg-slate-800/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">
                                Email Notifications
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Receive email reminders when your tokens are running low.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="tokenReminderPush"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/20 p-4 bg-slate-800/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">
                                Push Notifications
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Receive push reminders when your tokens are running low.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-purple-500/20" />
                  
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-white">Marketing</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/20 p-4 bg-slate-800/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">
                                Marketing Emails
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Receive emails about new features and special offers.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Save Preferences
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Billing Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your billing information and view payment history.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="rounded-xl border border-purple-500/20 p-6 bg-gradient-to-r from-slate-900/50 to-purple-900/20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Payment Method</h3>
                    <p className="text-sm text-gray-300">
                      Visa ending in 4242
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  >
                    Update
                  </Button>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-300">Billing Address</h4>
                  <p className="text-sm text-gray-400">
                    123 Main St<br />
                    Anytown, CA 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 text-white">Payment History</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center rounded-xl border border-purple-500/20 p-4 bg-slate-800/30">
                    <div>
                      <div className="font-medium text-white">Pro Plan - 50 Tokens</div>
                      <div className="text-xs text-gray-400">May 10, 2025</div>
                    </div>
                    <div className="font-medium text-green-400">$39.99</div>
                  </div>
                  <div className="flex justify-between items-center rounded-xl border border-purple-500/20 p-4 bg-slate-800/30">
                    <div>
                      <div className="font-medium text-white">Basic Plan - 10 Tokens</div>
                      <div className="text-xs text-gray-400">April 5, 2025</div>
                    </div>
                    <div className="font-medium text-green-400">$9.99</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                API Access
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your API keys for programmatic access to our platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FormProvider {...apiForm}>
                <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-6">
                  <FormField
                    control={apiForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">API Key</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input {...field} readOnly type="password" className="bg-slate-800/50 border-purple-500/30 text-white" />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                            onClick={() => {
                              navigator.clipboard.writeText(field.value);
                              toast({
                                title: "API key copied",
                                description: "The API key has been copied to your clipboard.",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <FormDescription className="text-gray-400">
                          Your API key provides full access to your account. Keep it secure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3 rounded-xl border border-purple-500/20 p-4 bg-slate-800/30">
                    <h3 className="text-sm font-medium text-white">API Documentation</h3>
                    <p className="text-sm text-gray-300">
                      Learn how to integrate with our API to automate 3D model generation and more.
                    </p>
                    <Button 
                      variant="outline"
                      className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                    >
                      View Documentation
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-0"
                  >
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Regenerate API Key
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}