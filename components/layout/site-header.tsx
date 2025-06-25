import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";
import { Cuboid as Cube } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed left-4 top-4 bottom-4 z-50 w-[280px]">
      <div className="h-full flex flex-col bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/10">
        <div className="border-b border-border/50 p-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80 group"
          >
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Cube className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              3D Platform
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <MainNav />
        </div>
        <div className="border-t border-border/50 p-3">
          <UserNav />
        </div>
      </div>
    </header>
  );
}