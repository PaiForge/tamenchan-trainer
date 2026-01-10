"use client";

import {
  pattern13Content,
  extractMarkdownTitle,
  removeMarkdownTitle,
} from "@tamenchan-trainer/content";
import dynamic from "next/dynamic";

// SSRを無効にしてクライアントサイドのみで読み込む
const MahjongMarkdown = dynamic(
  () =>
    import("../components/MahjongMarkdown").then((mod) => ({
      default: mod.MahjongMarkdown,
    })),
  { ssr: false },
);

/**
 * ホームページコンポーネント
 */
export default function Home() {
  const title = extractMarkdownTitle(pattern13Content);
  const body = removeMarkdownTitle(pattern13Content);

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>多面張トレーナー</h1>
      <p>麻雀の多面張待ち当てトレーニングアプリ</p>

      <section style={{ marginTop: "3rem" }}>
        <h2>{title}</h2>
        <MahjongMarkdown content={body} />
      </section>
    </main>
  );
}
