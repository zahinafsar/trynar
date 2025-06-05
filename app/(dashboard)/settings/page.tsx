"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your public profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself or your business"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of you or your business.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Save Changes
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Current Password</FormLabel>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <FormLabel>New Password</FormLabel>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <FormLabel>Confirm New Password</FormLabel>
                <Input type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">3D Model Notifications</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="modelCompletionEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Push Notifications
                              </FormLabel>
                              <FormDescription>
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
                  
                  <Separator />
                  
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Token Reminders</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="tokenReminderEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Push Notifications
                              </FormLabel>
                              <FormDescription>
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
                  
                  <Separator />
                  
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Marketing</h3>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Marketing Emails
                              </FormLabel>
                              <FormDescription>
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
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Save Preferences
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing information and view payment history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Visa ending in 4242
                    </p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Billing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Main St<br />
                    Anytown, CA 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Payment History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center rounded-lg border p-3">
                    <div>
                      <div className="font-medium">Pro Plan - 50 Tokens</div>
                      <div className="text-xs text-muted-foreground">May 10, 2025</div>
                    </div>
                    <div className="font-medium">$39.99</div>
                  </div>
                  <div className="flex justify-between items-center rounded-lg border p-3">
                    <div>
                      <div className="font-medium">Basic Plan - 10 Tokens</div>
                      <div className="text-xs text-muted-foreground">April 5, 2025</div>
                    </div>
                    <div className="font-medium">$9.99</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access to our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiForm}>
                <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-4">
                  <FormField
                    control={apiForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input {...field} readOnly type="password" />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={() => {
                            navigator.clipboard.writeText(field.value);
                            toast({
                              title: "API key copied",
                              description: "The API key has been copied to your clipboard.",
                            });
                          }}>
                            Copy
                          </Button>
                        </div>
                        <FormDescription>
                          Your API key provides full access to your account. Keep it secure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">API Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn how to integrate with our API to automate 3D model generation and more.
                    </p>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                  
                  <Button type="submit" variant="destructive" disabled={isSubmitting}>
                    {isSubmitting && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Regenerate API Key
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}