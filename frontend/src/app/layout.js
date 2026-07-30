import './globals.css';

export const metadata = {
  title: 'El Mirador de la Quintana',
  description: 'Demana des de l\'aplicació del mòbil',
  icons: {
    icon: '/q.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
