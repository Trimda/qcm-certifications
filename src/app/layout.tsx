import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { QcmProvider } from '@/contexts/QcmContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import I18nProvider from '@/components/layout/I18nProvider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'QCM Certif — Préparez vos certifications',
  description: 'Préparez vos certifications SCRUM, DevOps et SAFe avec des QCM interactifs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body>
        <I18nProvider>
          <AuthProvider>
            <QcmProvider>
              <ThemeProvider>
                <div className="memphis-page flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ThemeProvider>
            </QcmProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
