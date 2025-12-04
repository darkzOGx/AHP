import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { TamaguiProvider } from '@/components/TamaguiProvider';
import TawkTo from '@/components/TawkTo';
import Link from 'next/link';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'AutohunterPro',
  description: 'AI-powered vehicle deal discovery. Create alerts for your favorite vehicles and never miss a great deal.',
  metadataBase: new URL('https://www.autohunterpro.com'),
  openGraph: {
    title: 'AutohunterPro - AI-Powered Vehicle Deal Discovery',
    description: 'AI-powered vehicle deal discovery. Create alerts for your favorite vehicles and never miss a great deal.',
    url: 'https://www.autohunterpro.com',
    siteName: 'AutohunterPro',
    images: [
      {
        url: '/og.jpeg',
        width: 1200,
        height: 630,
        alt: 'AutohunterPro - AI-Powered Vehicle Deal Discovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutohunterPro - AI-Powered Vehicle Deal Discovery',
    description: 'AI-powered vehicle deal discovery. Create alerts for your favorite vehicles and never miss a great deal.',
    images: ['/og.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: 'https://www.autohunterpro.com',
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KKNDWKNBJQ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KKNDWKNBJQ');
            `,
          }}
        />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-body antialiased bg-white" suppressHydrationWarning={true}>
        <TamaguiProvider>
          <AuthProvider>
            <OrganizationProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-2 md:px-4 py-4 md:py-8">
                  {children}
                </main>
              <footer className="w-full border-t border-gray-200 bg-white">
                <div className="container mx-auto py-6 px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    {/* Left side - Brand */}
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-900 font-semibold">AutoHunterPro</p>
                      <p className="text-xs text-gray-600">AI-powered vehicle deal discovery</p>
                    </div>

                    {/* Right side - Links */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm text-gray-600">
                      <Link href="/about" className="hover:text-brand-red-600 transition-colors">
                        About
                      </Link>
                      <Link href="/why" className="hover:text-brand-red-600 transition-colors">
                        Why
                      </Link>
                      <Link href="/pricing" className="hover:text-brand-red-600 transition-colors">
                        Pricing
                      </Link>
                      <Link href="/support" className="hover:text-brand-red-600 transition-colors">
                        Support
                      </Link>
                      <Link href="/privacy" className="hover:text-brand-red-600 transition-colors">
                        Privacy Policy
                      </Link>
                      <Link href="/copyright" className="hover:text-brand-red-600 transition-colors">
                        Copyright
                      </Link>
                    </div>
                  </div>

                  {/* Bottom - Copyright */}
                  <div className="text-center text-xs text-gray-600 pt-4 border-t border-gray-200">
                    © 2025 AutoHunterPro, Inc. All rights reserved.
                  </div>
                </div>
              </footer>
              </div>
              <Toaster />
              <TawkTo />
            </OrganizationProvider>
          </AuthProvider>
        </TamaguiProvider>
      </body>
    </html>
  );
}
