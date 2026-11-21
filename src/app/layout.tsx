import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { AuthProvider } from "@/auth/AuthProvider";
import { HeaderNav } from "@/components/HeaderNav";
import {
  AUTH_COOKIE_KEY,
  parseUsernameCookieValue,
} from "@/lib/authCookie";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yatter",
  description: "簡易SNS Yatter",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialUsername = parseUsernameCookieValue(
    cookieStore.get(AUTH_COOKIE_KEY)?.value
  );

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 font-sans text-gray-900 antialiased`}
      >
        <AuthProvider initialUsername={initialUsername}>
          <HeaderNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
