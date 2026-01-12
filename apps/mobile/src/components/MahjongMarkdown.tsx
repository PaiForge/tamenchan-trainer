/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Markdown, { RenderRules } from "react-native-markdown-display";
import { Hai } from "@pai-forge/mahjong-react-ui";
import {
  parseTileNotation,
  TILE_NOTATION_PATTERN,
} from "@tamenchan-trainer/content";

interface MahjongMarkdownProps {
  readonly content: string;
}

/**
 * カスタムレンダリングルール
 */
const customRules: RenderRules = {
  // テキストノードをカスタム処理
  text: (node, children, parent, styles) => {
    const textContent = node.content;

    // {{...}} パターンを検出（共通ユーティリティを使用）
    const tilePattern = new RegExp(TILE_NOTATION_PATTERN);
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
      try {
        const tiles = parseTileNotation(notation);
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
      } catch (error) {
        // パースに失敗した場合は元のテキストを表示
        console.warn(`Invalid tile notation: ${notation}`, error);
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
  // 改行を強制的に反映
  softbreak: (node, _children, _parent, _styles) => {
    return <Text key={node.key}>{"\n"}</Text>;
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
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4b5563", // gray-600
    paddingBottom: 8,
  },
  heading2: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0d9488", // teal-600 (primary)
    paddingLeft: 12,
  },
  heading3: {
    color: "#e5e7eb", // gray-200
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
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
