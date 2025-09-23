
import type { Metadata } from 'next';
import { Crimson_Text, Fleur_De_Leah } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AppProviders } from '@/components/AppProviders';
import { cn } from '@/lib/utils';

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson-text',
});

const fleurDeLeah = Fleur_De_Leah({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-fleur-de-leah',
});

const eveAdam = localFont({
  src: '../../public/fonts/Eve Adam.ttf',
  display: 'swap',
  variable: '--font-eve-adam',
});

const richford = localFont({
  src: '../../public/fonts/Richford-Regular.ttf',
  display: 'swap',
  variable: '--font-richford',
});

export const metadata: Metadata = {
  title: 'Kevin & Alison - Invitación de Boda',
  description: 'Te invitamos a celebrar nuestro amor. Kevin Zuniga & Alison Ney se casan y queremos que seas parte de este día tan especial. Únete a nosotros en esta celebración única.',
  keywords: ['boda', 'invitación', 'Kevin Zuniga', 'Alison Ney', 'matrimonio', 'celebración', 'amor'],
  authors: [{ name: 'Kevin & Alison' }],
  openGraph: {
    title: 'Kevin & Alison - Invitación de Boda',
    description: 'Te invitamos a celebrar nuestro amor. Únete a nosotros en este día tan especial.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Boda Kevin & Alison',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kevin & Alison - Invitación de Boda',
    description: 'Te invitamos a celebrar nuestro amor. Únete a nosotros en este día tan especial.',
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "font-body antialiased",
          crimsonText.variable,
          fleurDeLeah.variable,
          eveAdam.variable,
          richford.variable
        )} 
        suppressHydrationWarning
      >
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
        <SpeedInsights />
      </body>
    </html>
  );
}
