import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JSON Generator for ChadCN',
  description:
    'Website with inputs for name, directory, dependency, and React component upload. It generates a JSON that can be hosted and used in ChadCN to import components directly into your repository.',
  keywords: [
    'Next.js',
    'React',
    'ChadCN',
    'JSON Generator',
    'Component Upload',
  ],
  openGraph: {
    title: 'JSON Generator for ChadCN',
    description:
      'Create and host JSON files with your React components and use them in ChadCN to import automatically.',
    url: 'https://joao-carmassi.github.io/shadcn-component-builder/',
    siteName: 'JSON Generator ChadCN',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
