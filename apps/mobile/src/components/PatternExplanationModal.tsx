import React from "react";
import { ScrollView } from "react-native";
import { BaseModal } from "./BaseModal";
import { MahjongMarkdown } from "./MahjongMarkdown";
import {
  extractMarkdownTitle,
  removeMarkdownTitle,
} from "@tamenchan-trainer/content";

interface PatternExplanationModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly content: string;
  readonly title?: string;
}

/**
 * パターン解説を表示するモーダルコンポーネント
 */
export function PatternExplanationModal({
  visible,
  onClose,
  content,
  title,
}: Readonly<PatternExplanationModalProps>) {
  // Extract H1 title from markdown content if title prop is not provided
  const extractedTitle = extractMarkdownTitle(content);
  const displayTitle = title ?? extractedTitle;

  // Remove H1 from content to avoid duplication in the body
  const bodyContent = removeMarkdownTitle(content);

  return (
    <BaseModal visible={visible} onClose={onClose} title={displayTitle}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <MahjongMarkdown content={bodyContent} />
      </ScrollView>
    </BaseModal>
  );
}
