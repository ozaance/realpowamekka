import { getPost, getAllPosts } from '@/lib/posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: `${post.title} — Powamekka`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return (
    <>
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
          <p>Vous êtes dans le BTP et vous voulez savoir ce que l&apos;IA peut faire pour votre activité ?</p>
          <a href="https://wa.me/33605715122?text=Bonjour%2C%20j%27ai%20lu%20votre%20article%20et%20je%20voudrais%20en%20savoir%20plus." target="_blank" rel="noopener noreferrer" className="btn" style={{ borderRadius: 18 }}>Demander un audit gratuit →</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
