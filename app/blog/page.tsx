import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Powamekka | IA & Systèmes Digitaux pour PME',
  description: "Conseils pratiques sur l'automatisation, l'intelligence artificielle et les systèmes digitaux pour les dirigeants de PME et artisans BTP.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <Navbar />
      <main className="blog-index wrap">
        <header className="blog-header">
          <p className="blog-kicker">RESSOURCES</p>
          <h1 className="blog-title">Conseils & analyses</h1>
          <p className="blog-subtitle">Pour les dirigeants qui veulent avancer avec méthode.</p>
        </header>
        <div className="blog-grid">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              <span className="blog-card-cat">{post.category}</span>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-desc">{post.description}</p>
              <div className="blog-card-meta">
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
