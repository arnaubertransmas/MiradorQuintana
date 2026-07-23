import './globals.css';

export const metadata = {
  title: 'Mirador Quintana',
  description: 'Browse the menu and order straight from your table.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
