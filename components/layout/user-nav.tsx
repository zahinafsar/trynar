"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, CreditCard, Mail } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-auto w-full px-4 py-3 justify-start gap-4 hover:bg-primary/5 transition-all duration-200 rounded-lg group"
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg transition-transform duration-200 group-hover:scale-105">
            <AvatarImage src="/avatar.jpg" className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left space-y-1.5">
            <span className="text-sm font-semibold leading-none tracking-tight">
              John Doe
            </span>
            <span className="text-xs text-muted-foreground/80 truncate max-w-[140px] leading-none">
              john.doe@example.com
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
        <DropdownMenuLabel className="font-normal px-4 py-3">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-semibold leading-none">John Doe</p>
            <p className="text-xs text-muted-foreground/80">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem className="px-4 py-2.5 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10">
            <User className="mr-3.5 h-4 w-4" />
            <span className="font-medium">Profile</span>
            <DropdownMenuShortcut className="text-xs text-muted-foreground/70">
              ⇧⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10">
            <CreditCard className="mr-3.5 h-4 w-4" />
            <span className="font-medium">Billing</span>
            <DropdownMenuShortcut className="text-xs text-muted-foreground/70">
              ⌘B
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem 
            asChild 
            className="px-4 py-2.5 cursor-pointer rounded-md transition-colors duration-150 focus:bg-primary/10"
          >
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-3.5 h-4 w-4" />
              <span className="font-medium">Settings</span>
              <DropdownMenuShortcut className="text-xs text-muted-foreground/70 ml-auto">
                ⌘S
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1.5" />
        <div className="p-1.5">
          <DropdownMenuItem 
            className="px-4 py-2.5 cursor-pointer rounded-md transition-colors duration-150 text-destructive focus:text-destructive focus:bg-destructive/10" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3.5 h-4 w-4" />
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