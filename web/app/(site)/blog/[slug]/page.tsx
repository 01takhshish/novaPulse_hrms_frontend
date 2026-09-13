import { getPostRedirect } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { FaArrowRight, FaClock } from "react-icons/fa6";
import { DemoButton } from "@/components/demo-modal";
import { PostBody } from "@/lib/blog/markdown";
import { BlobBackdrop } from "@/components/motion/blob-backdrop";
import { Reveal } from "@/components/motion/reveal";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { formatPostDate, getPost, getPostSlugs, getPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.date.toISOString(),
      authors: [post.author],
      tags: [...post.tags],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    const target = await getPostRedirect(slug);
    if (target) permanentRedirect(`/blog/${target}`);
    notFound();
  }

  const more = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 2);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/images/logo-og.png` },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <ReadingProgress />

      <article>
        <header className="relative overflow-hidden bg-gradient-to-b from-purple-100/70 via-slate-50 to-white pt-32 pb-14 md:pt-40 md:pb-16">
          <BlobBackdrop />
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-slate-500">
                <Link href="/" className="inline-block py-1.5 hover:text-brand-800">Home</Link>
                <span className="mx-2 text-slate-300">/</span>
                <Link href="/blog" className="inline-block py-1.5 hover:text-brand-800">Blog</Link>
              </nav>
            </Reveal>
            <Reveal delay={60}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-brand-800">{tag}</span>
                ))}
                <time dateTime={post.date.toISOString()}>{formatPostDate(post.date)}</time>
                <span className="inline-flex items-center gap-1">
                  <FaClock className="text-[10px]" /> {post.readingMinutes} min read
                </span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-4 text-3xl/[1.15] font-extrabold tracking-tight text-slate-900 md:text-5xl/[1.1]">
                {post.title}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{post.description}</p>
            </Reveal>
          </div>
        </header>

        <div className="bg-white pb-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
            {post.cover && (
              <div className={post.headings.length > 2 ? "lg:col-span-9 lg:order-1" : "lg:col-span-12"}>
                <Reveal variant="scale">
                  <figure className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? ""}
                      fill
                      sizes="(min-width: 1024px) 960px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </figure>
                </Reveal>
              </div>
            )}
            {post.headings.length > 2 && (
              <aside className="lg:col-span-3 lg:order-2">
                <nav aria-label="On this page" className="lg:sticky lg:top-28">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    On this page
                  </p>
                  <ul className="space-y-2 border-l border-slate-200 pl-4 text-sm">
                    {post.headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className="block py-1 leading-snug text-slate-500 transition-colors hover:text-brand-800"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}

            <div className={post.headings.length > 2 ? "lg:col-span-9 lg:order-1" : "lg:col-span-12"}>
            <div className="border-t border-slate-200 pt-10">
              <PostBody source={post.content} />
            </div>

            </div>
            <div className={post.headings.length > 2 ? "lg:col-span-9 lg:order-1" : "lg:col-span-12"}>
            <Reveal variant="scale" className="mt-16">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-8 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.35),transparent_60%)]" />
                <div className="relative z-10">
                  <h2 className="text-xl font-extrabold text-white md:text-2xl">
                    Want this looked at for your setup?
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-purple-200">
                    We&rsquo;ll review your current attendance, payroll or hiring process and tell
                    you what we&rsquo;d change — including when the answer is nothing.
                  </p>
                  <DemoButton
                    source={`blog-${post.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-900 shadow-lg transition-transform hover:scale-102"
                  >
                    Book a free demo <FaArrowRight className="text-xs" />
                  </DemoButton>
                </div>
              </div>
            </Reveal>
            </div>
          </div>
        </div>

        {more.length > 0 && (
          <section className="border-t border-slate-200 bg-slate-50 py-16">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-brand-800">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {more.map((other, i) => (
                  <Reveal key={other.slug} delay={i * 90}>
                    <Link
                      href={`/blog/${other.slug}`}
                      className="lift group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 hover:border-brand-400 hover:shadow-xl"
                    >
                      <span className="text-[11px] font-bold text-brand-800">
                        {other.tags[0]}
                      </span>
                      <h3 className="mt-2 text-base font-bold leading-snug text-slate-900">
                        {other.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                        {other.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-800">
                        Read more
                        <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
