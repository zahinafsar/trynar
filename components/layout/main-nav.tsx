"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Cuboid as Cube, Coins, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

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
  // {
  //   title: "3D Models",
  //   href: "/models",
  //   icon: <Cube className="h-5 w-5" />,
  // },
  {
    title: "Tokens",
    href: "/tokens",
    icon: <Coins className="h-5 w-5" />,
  },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: <Settings className="h-5 w-5" />,
  // },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 p-4">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
              pathname === item.href
                ? "text-primary-foreground bg-primary shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "transition-transform duration-200 group-hover:scale-110",
              pathname === item.href && "scale-110"
            )}>
              {item.icon}
            </div>
            <span className="font-medium">{item.title}</span>
            {pathname === item.href && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}