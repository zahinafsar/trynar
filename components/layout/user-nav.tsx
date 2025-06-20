"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, CreditCard } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";
import { signOut } from "@/lib/auth";

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to log out",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-auto w-full px-3 py-2 justify-start gap-3 hover:bg-primary/5 transition-all duration-200 rounded-lg group"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-lg transition-transform duration-200 group-hover:scale-105">
            <AvatarImage src={user?.user_metadata?.avatar_url} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getUserInitials(user?.user_metadata?.full_name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left space-y-1">
            <span className="text-sm font-semibold leading-none tracking-tight">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground/80 truncate max-w-[140px] leading-none">
              {userEmail}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 p-2" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground/80">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10">
            <User className="mr-3 h-4 w-4" />
            <span className="font-medium">Profile</span>
            <DropdownMenuShortcut className="text-xs text-muted-foreground/70">
              ⇧⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10">
            <CreditCard className="mr-3 h-4 w-4" />
            <span className="font-medium">Billing</span>
            <DropdownMenuShortcut className="text-xs text-muted-foreground/70">
              ⌘B
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem 
            asChild 
            className="px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10"
          >
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-3 h-4 w-4" />
              <span className="font-medium">Settings</span>
              <DropdownMenuShortcut className="text-xs text-muted-foreground/70 ml-auto">
                ⌘S
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />
        <div className="p-1">
          <DropdownMenuItem 
            className="px-3 py-2 cursor-pointer rounded-md transition-colors duration-150 text-destructive focus:text-destructive focus:bg-destructive/10" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Log out</span>
            <DropdownMenuShortcut className="text-xs opacity-70">
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}