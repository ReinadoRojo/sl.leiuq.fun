import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leiuq Shortlink",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
    noarchive: true,
    noimageindex: true,
    notranslate: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
