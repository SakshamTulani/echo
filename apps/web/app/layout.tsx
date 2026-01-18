import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@workspace/ui/components/sonner";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "Echo",
    template: "%s | Echo",
  },
  description:
    "Echo is an AI-powered customer support platform that helps you engage with your customers seamlessly.",
  keywords: [
    "customer support",
    "AI support",
    "chatbot",
    "customer engagement",
    "help desk",
    "Echo",
  ],
  authors: [{ name: "Saksham Tulani" }],
  creator: "Echo",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Echo",
    title: "Echo",
    description:
      "AI-powered customer support platform for seamless customer engagement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo",
    description:
      "AI-powered customer support platform for seamless customer engagement.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#3C82F6",
            },
          }}>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
