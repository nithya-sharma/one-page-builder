import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UniPage - Create Stunning Websites with AI',
  description: 'Build, customize, and publish a modern website from a single prompt.',
  keywords: 'AI website generator, web design, artificial intelligence, website builder, Next.js, Tailwind CSS',
  authors: [{ name: 'Nithya Sharma' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'UniPage - Create Stunning Websites with AI',
    description: 'Build, customize, and publish a modern website from a single prompt.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniPage - Create Stunning Websites with AI',
    description: 'Build, customize, and publish a modern website from a single prompt.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
