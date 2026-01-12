import {
  allPatterns,
  extractMarkdownTitle,
  removeMarkdownTitle,
} from "@tamenchan-trainer/content";
import { BookLayout } from "@/components/layout/BookLayout";
import { ClientMahjongMarkdown } from "@/components/ClientMahjongMarkdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static paths for all patterns
 */
export function generateStaticParams() {
  return allPatterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

/**
 * Generate metadata for the pattern page
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = allPatterns.find((p) => p.slug === slug);
  if (!pattern) return { title: "Not Found" };

  const title = extractMarkdownTitle(pattern.ja);
  return {
    title: `${title} | 多面張トレーナー`,
  };
}

/**
 * Pattern detail page component
 */
export default async function PatternPage({ params }: PageProps) {
  const { slug } = await params;
  const pattern = allPatterns.find((p) => p.slug === slug);

  if (!pattern) {
    notFound();
  }

  const title = extractMarkdownTitle(pattern.ja);
  const body = removeMarkdownTitle(pattern.ja);

  return (
    <BookLayout>
      <section>
        <h1
          style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}
        >
          {title}
        </h1>
        <ClientMahjongMarkdown content={body} />
      </section>
    </BookLayout>
  );
}
