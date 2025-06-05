import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { Cuboid as Cube } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-40 h-full w-[240px] border-r border-secondary bg-secondary/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        <div className="border-b border-secondary p-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Cube className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">
              3D Platform
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
        <div className="border-t border-secondary p-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
}