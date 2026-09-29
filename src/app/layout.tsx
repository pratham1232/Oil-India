import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'NWIS — Nearby Wells Intelligence System',
  description: 'AI-driven drilling intelligence with historical offset-well knowledge, geospatial analysis, and real-time risk assessment. Designed for future integration with OIL eRTMAC.',
  keywords: 'NWIS, eRTMAC, drilling, oil, gas, intelligence, risk, RAG, wells, OIL India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
