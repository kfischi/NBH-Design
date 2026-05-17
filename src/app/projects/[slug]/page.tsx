import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectBySlug } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";
import ProjectPageClient from "./ProjectPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const description = project.problem.slice(0, 155);
  const imageUrl = project.coverPhoto
    ? `${SITE_URL}/projects/photos/${project.coverPhoto}`
    : `${SITE_URL}/og-image.jpg`;

  return {
    title: `${project.title} | Proto-Model`,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `${SITE_URL}/projects/${project.slug}`,
      siteName: "Proto-Model",
      locale: "he_IL",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.altText ?? project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return <ProjectPageClient project={project} />;
}
