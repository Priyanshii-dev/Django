import type { Metadata } from "next";
import "../styles/globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todo",
  description: "Next.js frontend for the Django todo API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
