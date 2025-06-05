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
          className="relative h-auto w-full px-3 py-2.5 justify-start gap-4 hover:bg-primary/5 transition-colors duration-200"
        >
          <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-sm">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left space-y-1">
            <span className="text-sm font-semibold leading-none">John Doe</span>
            <span className="text-xs text-muted-foreground truncate max-w-[130px] leading-none">
              john.doe@example.com
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-4 py-3">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
            <User className="mr-3 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
            <CreditCard className="mr-3 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer">
            <Link href="/settings">
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            className="px-4 py-2.5 cursor-pointer text-destructive focus:text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}