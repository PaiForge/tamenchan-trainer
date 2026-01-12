/* eslint-disable */
// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

const MahjongMarkdownInner = dynamic(
  () => import("./MahjongMarkdown").then((mod) => mod.MahjongMarkdown),
  { ssr: false },
);

interface Props {
  readonly content: string;
}

/**
 * Client-side wrapper for MahjongMarkdown to support dynamic import with no SSR
 */
export function ClientMahjongMarkdown({ content }: Props) {
  return <MahjongMarkdownInner content={content} />;
}
