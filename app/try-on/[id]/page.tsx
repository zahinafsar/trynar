"use client";

import dynamic from "next/dynamic";

// Dynamically import VirtualTryOn with SSR disabled
const VirtualTryOn = dynamic(
  () =>
    import("@/components/try-on").then((mod) => ({
      default: mod.VirtualTryOn,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading Virtual Try-On...</p>
        </div>
      </div>
    ),
  }
);

export default function ARTryOnPage() {
  return <VirtualTryOn />;
}
