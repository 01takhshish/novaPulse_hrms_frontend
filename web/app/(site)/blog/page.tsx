import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaClock, FaRss } from "react-icons/fa6";
import { BlobBackdrop } from "@/components/motion/blob-backdrop";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { formatPostDate, getPosts, getTags } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical writing on HRMS, biometric attendance, payroll automation, workplace security and B2B growth — for people running growing businesses in India.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [posts, tags] = await Promise.all([getPosts(tag), getTags()]);
  const [lead, ...rest] = posts;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} Blog`,
    url: `${site.url}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date.toISOString(),
      url: `${site.url}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/70 via-slate-50 to-white pt-32 pb-16 md:pt-40 md:pb-20">
        <BlobBackdrop />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <span className="mb-6 inline-block rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-900">
              Insights
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-4xl/[1.1] font-extrabold tracking-tight text-slate-900 md:text-6xl/[1.05]">
              Notes from the{" "}
              <span className="bg-gradient-to-r from-brand-900 via-purple-800 to-brand-700 bg-clip-text text-transparent">
                deployment floor
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              What we learn installing attendance hardware, wiring payroll and building outbound
              pipelines for growing Indian businesses. No vendor fluff.
            </p>
          </Reveal>
          {tags.length > 0 && (
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/blog"
                  aria-current={!tag ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                    !tag
                      ? "border-brand-800 bg-brand-800 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-400"
                  }`}
                >
                  All <span className={!tag ? "text-brand-200" : "text-slate-400"}>{tags.reduce((n, t) => n + t.count, 0)}</span>
                </Link>
                {tags.map((entry) => {
                  const active = tag?.toLowerCase() === entry.tag.toLowerCase();
                  return (
                    <Link
                      key={entry.tag}
                      href={`/blog?tag=${encodeURIComponent(entry.tag)}`}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                        active
                          ? "border-brand-800 bg-brand-800 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-400"
                      }`}
                    >
                      {entry.tag}{" "}
                      <span className={active ? "text-brand-200" : "text-slate-400"}>
                        {entry.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="mx-auto max-w-6xl px-6">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl" aria-hidden="true">🔍</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                Nothing tagged &ldquo;{tag}&rdquo; yet
              </p>
              <Link href="/blog" className="link-underline mt-2 inline-block py-1.5 text-sm font-bold text-brand-800">
                See all posts
              </Link>
            </div>
          ) : (
            <>
              {lead && (
                <Reveal variant="scale">
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="lift group mb-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 hover:border-brand-400 hover:shadow-xl lg:grid-cols-2"
                  >
                    <div className="relative min-h-[240px] bg-gradient-to-br from-brand-900 via-purple-900 to-slate-900 p-10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.4),transparent_60%)]" />
                      {lead.cover ? (
                        <Image
                          src={lead.cover}
                          alt={lead.coverAlt ?? ""}
                          fill
                          sizes="(min-width: 1024px) 600px, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="relative z-10 flex h-full flex-col justify-end">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                            Featured
                          </span>
                          <p className="mt-2 text-2xl font-extrabold leading-tight text-white">
                            {lead.tags[0] ?? "Latest"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-10">
                      <PostMetaLine post={lead} />
                      <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl">
                        {lead.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        {lead.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-800">
                        Read the post
                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" step={100}>
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="lift sheen group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-7 hover:border-brand-400 hover:shadow-xl"
                  >
                    <div>
                      <PostMetaLine post={post} />
                      <h2 className="mt-3 text-lg font-bold leading-snug text-slate-900">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {post.description}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-brand-800">
                      Read more
                      <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </RevealGroup>

              <Reveal className="mt-14 text-center">
                <a
                  href="/blog/feed.xml"
                  className="inline-flex items-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-brand-800"
                >
                  <FaRss /> Subscribe via RSS
                </a>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function PostMetaLine({ post }: { post: { date: Date; readingMinutes: number; tags: string[] } }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500">
      {post.tags[0] && <span className="text-brand-800">{post.tags[0]}</span>}
      <time dateTime={post.date.toISOString()}>{formatPostDate(post.date)}</time>
      <span className="inline-flex items-center gap-1">
        <FaClock className="text-[10px]" /> {post.readingMinutes} min read
      </span>
    </div>
  );
}
