"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Cuboid as Cube, Coins, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "3D Models",
    href: "/models",
    icon: <Cube className="h-5 w-5" />,
  },
  {
    title: "Tokens",
    href: "/tokens",
    icon: <Coins className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
              pathname === item.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </div>
  );
}