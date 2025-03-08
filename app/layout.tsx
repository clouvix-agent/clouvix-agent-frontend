import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clouvix",
  description: "Clouvix",
};

function GridPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '1cm 1cm',
        backgroundPosition: 'center',
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        <GridPattern />
        {children}
      </body>
    </html>
  );
}
