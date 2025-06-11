import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Bot from "@/components/Bot";
import CMD from "@/components/CMD";
import "./globals.css";
import SessionRoute from "@/components/SessionRoute";

export const metadata = {
  title: "DevToolbox - Developer Utilities Suite",
  description: "A modern, full-featured developer toolbox web app with API tester, code tools, color picker, hash generator, and more. Built with Next.js, React, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.",
  keywords: [
    "developer tools",
    "API tester",
    "code explain",
    "color picker",
    "hash generator",
    "Next.js",
    "React",
    "Prisma",
    "NextAuth",
    "toolbox"
  ],
  authors: [{ name: "Voora Venkata Sai Ganesh" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "DevToolbox - Developer Utilities Suite",
    description: "A modern, full-featured developer toolbox web app for all your development needs.",
    url: "https://your-domain.com",
    siteName: "DevToolbox",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DevToolbox"
      }
    ],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionRoute>
          <Navbar />
          {children}
          <Bot />
          <CMD />
          <Footer />
        </SessionRoute>
      </body>
    </html>
  );
}