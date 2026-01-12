import { allPatterns, extractMarkdownTitle } from "@tamenchan-trainer/content";
import { BookLayout } from "@/components/layout/BookLayout";
import Link from "next/link";
import React from "react";

/**
 * ホームページコンポーネント (パターン一覧)
 */
export default function Home() {
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
          Tamenchan Trainer
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            lineHeight: "1.3",
            marginBottom: "1rem",
          }}
        >
          トレーニングパターン一覧
        </h1>
        <p style={{ color: "#666" }}>多面張の形をパターン別に学習できます。</p>
      </header>

      <div style={{ display: "grid", gap: "1rem" }}>
        {allPatterns.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/articles/patterns/${pattern.slug}`}
            style={{
              display: "block",
              padding: "1.5rem",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              transition: "box-shadow 0.2s",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {extractMarkdownTitle(pattern.ja)}
            </h2>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>
              {pattern.slug}
            </span>
          </Link>
        ))}
      </div>
    </BookLayout>
  );
}
