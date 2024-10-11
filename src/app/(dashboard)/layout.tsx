import { ApiKeySelectedProvider } from "./_components/selected-key-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApiKeySelectedProvider>{children}</ApiKeySelectedProvider>;
}
