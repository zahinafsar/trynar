import { SiteHeader } from "@/components/layout/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-grid-white">
      <SiteHeader />
      <main className="flex-1 px-8 py-6 ml-[240px] relative">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-xl -z-10" />
        {children}
      </main>
    </div>
  );
}