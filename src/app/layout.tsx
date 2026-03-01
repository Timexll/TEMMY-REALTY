u
import import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirebaseClientProvider } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Temmy Realty Hub | Buy & Rent Homes in the US",
  description:
    "Temmy American Realty specializes in luxury family homes and quality rental apartments across the United States.",
  verification: {
    google: "w-YA9b4lNfzBaaZjJEEjHe7sJhcWazAd5A1Loc_o7xw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
