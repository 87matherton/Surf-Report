import React from 'react';
import ClientThemeProvider from '../src/components/ThemeProvider';

export const metadata = {
  title: 'WaveCheck - Surf Report',
  description: 'Real-time surf conditions and forecasts for your favorite spots',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
