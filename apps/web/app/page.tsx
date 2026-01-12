"use client";

import {
  pattern13Content,
  extractMarkdownTitle,
  removeMarkdownTitle,
} from "@tamenchan-trainer/content";
import { BookLayout } from "../components/layout/BookLayout";
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
    <BookLayout>
      <header
        style={{
          marginBottom: "3rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            color: "#888",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          Chapter 01
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            lineHeight: "1.3",
          }}
        >
          {title}
        </h1>
        {/* Author info placeholder similar to Zenn */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "1rem",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#ddd",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "#666" }}>
            Tamenchan Official
          </span>
          <span style={{ fontSize: "0.85rem", color: "#ccc" }}>•</span>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>2025.01.12</span>
        </div>
      </header>

      <div className="markdown-body">
        <MahjongMarkdown content={body} />
      </div>
    </BookLayout>
  );
}
