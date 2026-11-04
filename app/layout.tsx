import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mind Reader — High-Low Number Guessing Game',
  description:
    'A clean, competitive number guessing duel between human deduction and algorithmic strategy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
        {/* Subtle, natural top accent glow */}
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]" />
        {children}
      </body>
    </html>
  );
}
