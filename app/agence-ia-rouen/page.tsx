import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { breadcrumbJsonLd, jsonLdScript, serviceJsonLd } from '@/lib/schema';
import type { Metadata } from 'next';

/**
 * Page locale unique : « IA à Rouen ».
 *
 * Powamekka exerce son activité à Rouen ; l'accompagnement se fait uniquement
 * à distance. Aucun rendez-vous sur place ni local ouvert au public n'est
 * promis, et aucun balisage de commerce local avec adresse n'est ajouté
 * (seulement un `Service` dont la zone desservie inclut Rouen).
 * Voir seo/strategie.md, cluster 6.
 */

const PATH = '/agence-ia-rouen';
const TITLE = 'Agence IA à Rouen : automatisation pour PME | Powamekka';
const DESCRIPTION =
  "Agence IA à Rouen pour les PME du BTP et des services : devis, relances, tri des demandes. Accompagnement à distance, de l'audit à la formation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'website',
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powamekka : IA à Rouen' }],
  },
};

const WA = `https://wa.me/33635097980?text=${encodeURIComponent(
  "Bonjour, je dirige une entreprise et je souhaite un premier échange au sujet de l'IA.",
)}`;

const usages = [
  {
    title: 'Devis et documents',
    desc: "Préparer un premier jet de devis, de bon de commande ou de rapport d'intervention à partir de vos modèles et de vos données. Vous relisez, vous validez, vous envoyez.",
  },
  {
    title: 'Relances',
    desc: "Les devis restés sans réponse et les factures en attente sont relancés au bon moment, avec un message adapté, sans tenir de tableau à la main.",
  },
  {
    title: 'Demandes entrantes',
    desc: "E-mails, formulaires, messages : l'IA les trie, les résume et prépare une réponse pour les demandes courantes. Les cas qui demandent votre jugement vous reviennent.",
  },
  {
    title: 'Suivi et tableaux de bord',
    desc: "Les informations dispersées entre plusieurs outils sont rassemblées dans une vue claire : devis en cours, chantiers ou dossiers ouverts, charge de l'équipe.",
  },
];

const etapes = [
  {
    no: '01',
    title: 'Premier échange',
    desc: "Un appel ou une visioconférence pour comprendre votre activité et ce qui vous fait perdre du temps. Gratuit et sans engagement.",
  },
  {
    no: '02',
    title: 'Audit',
    desc: "Nous analysons vos tâches, vos outils et vos données, puis nous classons les automatisations possibles par ordre d'impact.",
    href: '/services/audit',
    label: "l'audit stratégique",
  },
  {
    no: '03',
    title: 'Mise en place',
    desc: "Nous déployons les automatisations retenues et nous relions vos outils entre eux, une étape à la fois, sur vos processus réels.",
    href: '/services/systemes',
    label: 'les systèmes digitaux',
  },
  {
    no: '04',
    title: 'Formation',
    desc: "Vos équipes apprennent à utiliser les outils déployés chez elles, à partir de leurs propres cas, pour que l'usage tienne dans la durée.",
    href: '/services/formation',
    label: 'la formation',
  },
];

const faq = [
  {
    question: 'Faut-il être installé à Rouen pour travailler avec Powamekka ?',
    answer:
      "Non. Powamekka exerce son activité à Rouen et accompagne des entreprises partout en France. Comme tout l'accompagnement se fait à distance, votre localisation ne change rien au déroulé de la mission.",
  },
  {
    question: 'Les rendez-vous se font-ils dans vos locaux ou dans les nôtres ?',
    answer:
      "Ni l'un ni l'autre. L'accompagnement se fait uniquement à distance : visioconférence, téléphone, e-mail et partage de documents en ligne. Nous ne recevons pas de public et nous ne nous déplaçons pas dans les entreprises.",
  },
  {
    question: 'Travaillez-vous avec les particuliers ?',
    answer:
      "Non. Powamekka travaille exclusivement avec des professionnels : entreprises, artisans et indépendants. Le BTP et les entreprises de services sont nos priorités, sans exclure les autres secteurs.",
  },
  {
    question: "Faut-il des compétences techniques pour intégrer l'IA dans son entreprise ?",
    answer:
      "Non. Les outils sont conçus pour être utilisés par vos équipes, pas par des développeurs. La formation fait partie de la mission et porte sur les outils réellement déployés chez vous.",
  },
  {
    question: 'Combien coûte un accompagnement en IA ?',
    answer:
      "Chaque projet fait l'objet d'un devis établi après un premier échange, en fonction des tâches à automatiser, des outils déjà en place et du volume à traiter. Le premier échange est gratuit et sans engagement.",
  },
  {
    question: 'Par quoi commencer ?',
    answer:
      "Par une tâche qui revient chaque semaine et suit toujours la même logique : la rédaction des devis, les relances ou le tri des demandes. L'audit sert à identifier les deux ou trois tâches qui coûtent le plus de temps chez vous et à les traiter dans l'ordre.",
  },
];

const serviceSchema = {
  ...serviceJsonLd({
    name: 'Conseil en intelligence artificielle pour PME à Rouen',
    description: DESCRIPTION,
    url: PATH,
    serviceType: 'Conseil en intelligence artificielle',
  }),
  // Zone desservie seulement : aucune adresse, aucun commerce local.
  areaServed: [
    { '@type': 'City', name: 'Rouen' },
    { '@type': 'Country', name: 'France' },
  ],
};

const breadcrumbSchema = breadcrumbJsonLd([
  { name: 'Accueil', url: '/' },
  { name: 'IA à Rouen', url: PATH },
]);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const mono = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: 'var(--ink-dim)',
};

const section = { padding: 'clamp(60px,10vh,120px) 0', borderBottom: '1px solid var(--line)' };

const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(26px,3vw,40px)',
  fontWeight: 400,
  color: 'var(--ink)',
  lineHeight: 1.15,
  marginBottom: 24,
  maxWidth: '22ch',
};

const body = { fontSize: 15, lineHeight: 1.75, color: 'var(--ink-dim)', maxWidth: '62ch' };

const link = { color: 'var(--gold)' };

export default function AgenceIARouenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([serviceSchema, breadcrumbSchema, faqSchema]) }}
      />
      <Navbar />
      <main>
        {/* HERO */}
        <section style={{ borderBottom: '1px solid var(--line)', paddingTop: 'clamp(80px,13vh,150px)', paddingBottom: 'clamp(60px,10vh,120px)' }}>
          <div className="wrap">
            <p style={{ ...mono, color: 'var(--gold)', letterSpacing: '0.18em', marginBottom: 20 }}>IA à Rouen</p>
            <h1 className="display" style={{ maxWidth: '16ch', marginBottom: 28 }}>
              Agence IA à Rouen pour les PME.
            </h1>
            <p className="lede" style={{ maxWidth: '48ch' }}>
              Devis, relances, tri des demandes, suivi : nous mettons l&apos;intelligence artificielle au service
              des tâches qui prennent du temps à votre entreprise, sans changer votre façon de travailler.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 40 }}>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderRadius: 18 }}>
                Demander un premier échange <span className="ar">→</span>
              </a>
              <a
                href="mailto:contact@powamekka.com"
                style={{ borderRadius: 18, border: '1px solid var(--ink)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                contact@powamekka.com
              </a>
            </div>
          </div>
        </section>

        {/* À DISTANCE */}
        <section style={section}>
          <div className="wrap split split-16" style={{ display: 'grid', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
            <p style={mono}>Comment nous travaillons</p>
            <div>
              <h2 style={h2Style}>Une activité à Rouen, un accompagnement à distance.</h2>
              <p style={{ ...body, marginBottom: 18 }}>
                Powamekka exerce son activité à Rouen. Les missions se déroulent entièrement à distance : les
                échanges ont lieu en visioconférence, par téléphone et par écrit, et les documents comme les accès
                se partagent en ligne. Il n&apos;y a pas de rendez-vous sur place ni de local ouvert au public.
              </p>
              <p style={body}>
                Pour vous, cela veut dire des échanges courts, calés sur votre agenda plutôt que sur un temps de
                trajet, et un travail fait directement dans les outils que vous utilisez déjà. Une entreprise de
                l&apos;agglomération rouennaise et une entreprise installée ailleurs en France suivent exactement le
                même déroulé.
              </p>
            </div>
          </div>
        </section>

        {/* USAGES */}
        <section style={section}>
          <div className="wrap">
            <p style={{ ...mono, marginBottom: 20 }}>Ce que l&apos;IA prend en charge</p>
            <h2 style={h2Style}>Ce que l&apos;IA peut faire pour une PME, concrètement.</h2>
            <p style={{ ...body, marginBottom: 48 }}>
              L&apos;IA est utile quand elle s&apos;applique à une tâche précise, qui revient souvent et suit une
              logique stable. Voici les usages par lesquels nous commençons le plus souvent. Le détail figure sur la
              page <Link href="/services/ia" style={link}>IA &amp; automatisation</Link>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
              {usages.map((u, i) => (
                <div key={u.title} style={{ background: 'var(--paper)', padding: 'clamp(28px,3vw,42px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}>0{i + 1}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,1.9vw,26px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>{u.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)' }}>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POUR QUI */}
        <section style={section}>
          <div className="wrap split split-16" style={{ display: 'grid', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
            <p style={mono}>Pour qui</p>
            <div>
              <h2 style={h2Style}>Les PME du BTP et des services en priorité.</h2>
              <p style={{ ...body, marginBottom: 18 }}>
                Nous travaillons exclusivement avec des professionnels. Le BTP et les entreprises de services sont
                nos priorités, parce que le temps administratif y pèse lourd : devis à chiffrer, relances, comptes
                rendus, échanges avec les clients et les fournisseurs. Les autres secteurs ne sont pas exclus.
              </p>
              <p style={body}>
                Si vous dirigez une entreprise du bâtiment, l&apos;article{' '}
                <Link href="/blog/ia-btp-gagner-du-temps" style={link}>sur l&apos;IA dans le BTP</Link> montre les
                tâches par lesquelles commencer. Si vos outils ne se parlent pas, le{' '}
                <Link href="/blog/systeme-digital-pme-guide-2026" style={link}>guide du système digital pour PME</Link>{' '}
                explique comment les relier.
              </p>
            </div>
          </div>
        </section>

        {/* DÉROULÉ */}
        <section style={section}>
          <div className="wrap">
            <p style={{ ...mono, marginBottom: 20 }}>Le déroulé</p>
            <h2 style={h2Style}>Comment se déroule un accompagnement en IA.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: 'clamp(24px,3vw,40px)', marginTop: 40 }}>
              {etapes.map((e) => (
                <div key={e.no} style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}>{e.no}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,1.9vw,26px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, margin: '12px 0' }}>{e.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)' }}>
                    {e.desc}
                    {e.href && (
                      <>
                        {' '}Voir <Link href={e.href} style={link}>{e.label}</Link>.
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ ...body, marginTop: 40 }}>
              Vous hésitez encore sur le point de départ ? L&apos;article{' '}
              <Link href="/blog/par-ou-commencer-ia-entreprise" style={link}>par où commencer avec l&apos;IA en entreprise</Link>{' '}
              aide à choisir la première tâche à traiter, et celui sur{' '}
              <Link href="/blog/combien-coute-automatisation-pme" style={link}>le coût de l&apos;automatisation d&apos;une PME</Link>{' '}
              détaille ce qui fait varier un devis.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={section}>
          <div className="wrap split split-19" style={{ display: 'grid', gap: 'clamp(30px,6vw,80px)', alignItems: 'start' }}>
            <h2 className="sticky-desk" style={{ ...mono, fontWeight: 400 }}>Questions fréquentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3vw,40px)' }}>
              {faq.map((item) => (
                <div key={item.question}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px,1.8vw,25px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 14 }}>
                    {item.question}
                  </h3>
                  <p style={body}>{item.answer}</p>
                </div>
              ))}
              <p style={body}>
                D&apos;autres réponses sur la <Link href="/faq" style={link}>page des questions fréquentes</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: 'clamp(60px,10vh,120px) 0' }}>
          <div className="wrap">
            <h2 className="display" style={{ maxWidth: '16ch', marginBottom: 24 }}>Parlons de votre entreprise.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-dim)', marginBottom: 32, maxWidth: '46ch' }}>
              Un premier échange à distance, gratuit et sans engagement, pour savoir quelles tâches l&apos;IA peut
              prendre en charge chez vous.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderRadius: 18 }}>
                Écrire sur WhatsApp <span className="ar">→</span>
              </a>
              <Link
                href="/services/audit"
                style={{ borderRadius: 18, border: '1px solid var(--ink)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Découvrir l&apos;audit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
