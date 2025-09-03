import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JSON Generator for ChatCN',
  description:
    'Website with inputs for name, directory, dependency, and React component upload. It generates a JSON that can be hosted and used in ChatCN to import components directly into your repository.',
  keywords: [
    'Next.js',
    'React',
    'ChatCN',
    'JSON Generator',
    'Component Upload',
  ],
  openGraph: {
    title: 'JSON Generator for ChatCN',
    description:
      'Create and host JSON files with your React components and use them in ChatCN to import automatically.',
    url: 'https://joao-carmassi.github.io/shadcn-component-builder/',
    siteName: 'JSON Generator ChatCN',
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
