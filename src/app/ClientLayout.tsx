"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import VLibras from "vlibras-nextjs";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        <Navbar />
        <div className="pt-16 px-4 sm:px-8">{children}</div>
        <Toaster position="top-right" richColors />
        <VLibras forceOnload={true} /> {/* 🔹 VLibras global */}
      </AuthProvider>
    </ThemeProvider>
  );
}
