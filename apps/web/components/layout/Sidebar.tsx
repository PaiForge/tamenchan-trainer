/* eslint-disable */
// @ts-nocheck
import Link from "next/link";
import styles from "./BookLayout.module.css";
import {
  allPatterns,
  allBasics,
  extractMarkdownTitle,
} from "@tamenchan-trainer/content";

interface SidebarProps {
  readonly className?: string;
  readonly onLinkClick?: () => void;
}

/**
 * サイドバーコンポーネント
 *
 * デスクトップ表示時に左側に固定表示されるナビゲーション
 */
export function Sidebar({ className, onLinkClick }: SidebarProps) {
  return (
    <nav
      className={`${styles.sidebarWrapper} ${className ?? ""}`}
      aria-label="Book navigation"
    >
      <div style={{ padding: "1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#3ea8ff" }}
          >
            <Link
              href="/"
              style={{ color: "inherit", textDecoration: "none" }}
              onClick={onLinkClick}
            >
              Tamenchan
            </Link>
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#666" }}>
            多面張待ち当てトレーニング
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            基礎知識
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {
              allBasics.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/basics/${article.slug}`}
                    style={{
                      display: "block",
                      padding: "0.5rem 0",
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    onClick={onLinkClick}
                  >
                    {extractMarkdownTitle(article.ja)}
                  </Link>
                </li>
              )) as unknown as React.ReactNode
            }
          </ul>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            基本パターン
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {
              allPatterns.map((pattern) => (
                <li key={pattern.slug}>
                  <Link
                    href={`/articles/patterns/${pattern.slug}`}
                    style={{
                      display: "block",
                      padding: "0.5rem 0",
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    onClick={onLinkClick}
                  >
                    {extractMarkdownTitle(pattern.ja)}
                  </Link>
                </li>
              )) as unknown as React.ReactNode
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
