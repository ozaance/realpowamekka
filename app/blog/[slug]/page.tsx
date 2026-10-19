import { getPost, getAllPosts } from '@/lib/posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { blogPostingJsonLd, breadcrumbJsonLd, jsonLdScript } from '@/lib/schema';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: `${post.title} — Powamekka`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
  };
}

const CTA_BY_CATEGORY: Record<string, { text: string; message: string }> = {
  'BTP & IA': {
    text: "Vous êtes dans le BTP et vous voulez savoir ce que l'IA peut faire pour votre activité ?",
    message: "Bonjour, j'ai lu votre article et je voudrais en savoir plus.",
  },
};

const DEFAULT_CTA = {
  text: 'Vous voulez savoir ce que ça changerait concrètement dans votre entreprise ?',
  message: "Bonjour, j'ai lu votre article et je voudrais en savoir plus.",
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const cta = CTA_BY_CATEGORY[post.category] ?? DEFAULT_CTA;

  const jsonLd = [
    blogPostingJsonLd({ title: post.title, description: post.description, slug: post.slug, date: post.date }),
    breadcrumbJsonLd([
      { name: 'Accueil', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Navbar />
      <main className="blog-post wrap">
        <Link href="/blog" className="blog-back">← Retour aux articles</Link>
        <article>
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>
          </header>
          <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
        <div className="blog-post-cta">
          <p>{cta.text}</p>
          <a href={`https://wa.me/33605715122?text=${encodeURIComponent(cta.message)}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderRadius: 18 }}>Demander un audit gratuit →</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
