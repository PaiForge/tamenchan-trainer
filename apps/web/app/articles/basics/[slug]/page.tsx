import {
  allBasics,
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
 * Generate static paths for all basic articles
 */
export function generateStaticParams() {
  return allBasics.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Generate metadata for the basic article page
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = allBasics.find((p) => p.slug === slug);
  if (!article) return { title: "Not Found" };

  const title = extractMarkdownTitle(article.ja);
  return {
    title: `${title} | 多面張トレーナー`,
  };
}

/**
 * Basic article detail page component
 */
export default async function BasicArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = allBasics.find((p) => p.slug === slug);

  if (!article) {
    notFound();
  }

  const title = extractMarkdownTitle(article.ja);
  const body = removeMarkdownTitle(article.ja);

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
