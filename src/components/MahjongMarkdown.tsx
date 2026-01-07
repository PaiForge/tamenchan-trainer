/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Markdown, { RenderRules } from "react-native-markdown-display";
import { Hai } from "@pai-forge/mahjong-react-ui";
import { parseMspz } from "@pai-forge/riichi-mahjong";
import type { HaiKindId } from "@pai-forge/riichi-mahjong";

interface MahjongMarkdownProps {
  readonly content: string;
}

/**
 * 麻雀牌表記をパースしてHaiKindId配列に変換
 */
function parseTileNotation(notation: string): HaiKindId[] {
  try {
    const tehai = parseMspz(notation);
    return tehai.closed;
  } catch (error) {
    console.warn(`Invalid tile notation: ${notation}`, error);
    return [];
  }
}

/**
 * カスタムレンダリングルール
 */
const customRules: RenderRules = {
  // テキストノードをカスタム処理
  text: (node, children, parent, styles) => {
    const textContent = node.content;

    // {{...}} パターンを検出
    const tilePattern = /\{\{([^}]+)\}\}/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = tilePattern.exec(textContent)) !== null) {
      // マッチ前のテキスト
      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={styles.text}>
            {textContent.substring(lastIndex, match.index)}
          </Text>,
        );
      }

      // 牌表記部分
      const notation = match[1]; // "2223p"
      const tiles = parseTileNotation(notation);

      if (tiles.length > 0) {
        parts.push(
          <View
            key={`tiles-${match.index}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginHorizontal: 4,
            }}
          >
            {tiles.map((hai, index) => (
              <Hai
                key={index}
                hai={hai}
                size="xs"
                style={{ width: 24, height: 34 }}
              />
            ))}
          </View>,
        );
      } else {
        // パースに失敗した場合は元のテキストを表示
        parts.push(
          <Text key={`error-${match.index}`} style={styles.text}>
            {match[0]}
          </Text>,
        );
      }

      lastIndex = tilePattern.lastIndex;
    }

    // 残りのテキスト
    if (lastIndex < textContent.length) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={styles.text}>
          {textContent.substring(lastIndex)}
        </Text>,
      );
    }

    return parts.length > 0 ? (
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
      >
        {parts}
      </View>
    ) : (
      <Text key={node.key} style={styles.text}>
        {children}
      </Text>
    );
  },
};

/**
 * Markdownスタイル
 */
const markdownStyles = StyleSheet.create({
  body: {
    color: "#f3f4f6",
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: "#f9fafb",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },
  heading2: {
    color: "#f9fafb",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
  },
  heading3: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  text: {
    color: "#e5e7eb",
  },
  strong: {
    fontWeight: "bold",
    color: "#f9fafb",
  },
  code_inline: {
    backgroundColor: "#374151",
    color: "#fbbf24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
    fontSize: 14,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
    flexDirection: "row",
  },
  blockquote: {
    backgroundColor: "#1f2937",
    borderLeftColor: "#6366f1",
    borderLeftWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
});

/**
 * 麻雀牌表記をサポートするMarkdownレンダラー
 */
export function MahjongMarkdown({ content }: MahjongMarkdownProps) {
  return (
    <Markdown style={markdownStyles} rules={customRules}>
      {content}
    </Markdown>
  );
}
