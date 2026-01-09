import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "多面張トレーナー",
  description: "麻雀の多面張待ち当てトレーニングアプリ",
};

/**
 * ルートレイアウトコンポーネント
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
