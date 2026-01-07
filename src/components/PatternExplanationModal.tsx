import React from "react";
import { ScrollView } from "react-native";
import { BaseModal } from "./BaseModal";
import { MahjongMarkdown } from "./MahjongMarkdown";

interface PatternExplanationModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly content: string;
  readonly title: string;
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
  return (
    <BaseModal visible={visible} onClose={onClose} title={title}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <MahjongMarkdown content={content} />
      </ScrollView>
    </BaseModal>
  );
}
