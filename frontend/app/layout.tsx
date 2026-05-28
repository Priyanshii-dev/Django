import type { Metadata } from "next";
import "../styles/globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todo",
  description: "Next.js frontend for the Django todo API",
};

const themeScript = `
  (() => {
    try {
      const savedTheme = window.localStorage.getItem("todo-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = savedTheme ? savedTheme === "dark" : prefersDark;
      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      document.documentElement.classList.remove("dark");
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NuqsAdapter>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
