import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FinIntellect RBI | Enterprise Banking Decision Intelligence Platform',
  description: 'Enterprise banking financial intelligence, asset quality surveillance, and credit-deposit risk decision platform powered by Reserve Bank of India (RBI) data, PostgreSQL, and Google Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="bg-fintech-bg text-fintech-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

