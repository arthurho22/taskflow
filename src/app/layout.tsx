import "./globals.css";
import type { ReactNode } from "react";
import ClientLayout from "@/app/ClientLayout";

export const metadata = {
  title: "TaskFlow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
