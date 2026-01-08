import React from "react";
import { ScrollView } from "react-native";
import { BaseModal } from "./BaseModal";
import { MahjongMarkdown } from "./MahjongMarkdown";

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
  const match = /^#\s+(.+)$/m.exec(content);
  const extractedTitle = match ? match[1] : "";
  const displayTitle = title ?? extractedTitle;

  // Remove H1 from content to avoid duplication in the body
  const bodyContent = content.replace(/^#\s+.+$/m, "").trim();

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
