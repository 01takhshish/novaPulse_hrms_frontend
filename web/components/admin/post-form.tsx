"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowUpRightFromSquare, FaEye, FaPen } from "react-icons/fa6";
import { CoverUpload } from "@/components/admin/cover-upload";
import { PostBody } from "@/lib/blog/markdown";
import { slugify } from "@/lib/blog/derive";
import { savePostAction, type PostFormState } from "@/lib/blog/actions";
import { ErrorText, Field, input, labelText, TabButton } from "@/components/admin/fields";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  author: string;
  tags: string;
  coverUrl: string;
  coverAlt: string;
  featured: boolean;
  status: "draft" | "published";
};

const EMPTY: PostFormState = {};

export function PostForm({
  initial,
  onDelete,
}: {
  initial: PostFormValues;
  onDelete?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(savePostAction, EMPTY);

  // The server echoes the submitted values back on a rejection, so a failed
  // save never wipes what was typed.
  const values = { ...initial, ...(state.values ?? {}) } as PostFormValues;

  const [title, setTitle] = useState(values.title);
  const [slug, setSlug] = useState(values.slug);
  const [body, setBody] = useState(values.body);
  const [coverUrl, setCoverUrl] = useState(values.coverUrl);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const isNew = !initial.id;

  // Only a brand-new post follows the title. Once a post is published its slug
  // is a live URL, and silently changing it would break every inbound link.
  const slugTouched = useRef(!isNew);
  useEffect(() => {
    if (!slugTouched.current) setSlug(slugify(title));
  }, [title]);

  const errors = state.fieldErrors ?? {};
  const words = useMemo(() => body.trim().split(/\s+/).filter(Boolean).length, [body]);

  return (
    <>
    <form action={formAction} className="space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      {state.message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            state.ok
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Field label="Title" error={errors.title}>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={input}
              placeholder="Why month-end payroll takes three days"
              required
            />
          </Field>

          <Field
            label="Slug"
            error={errors.slug}
            hint={`novapulse.co.in/blog/${slug || "…"}`}
          >
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                slugTouched.current = true;
                setSlug(event.target.value);
              }}
              className={input}
              required
            />
          </Field>

          <Field
            label="Description"
            error={errors.description}
            hint="Shown on the blog listing and used as the meta description in search results."
          >
            <textarea
              name="description"
              defaultValue={values.description}
              rows={3}
              className={input}
              required
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={labelText}>Body</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">{words} words</span>
                <div className="flex rounded-lg border border-slate-200 p-0.5">
                  <TabButton active={tab === "write"} onClick={() => setTab("write")}>
                    <FaPen className="text-[10px]" /> Write
                  </TabButton>
                  <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
                    <FaEye className="text-[10px]" /> Preview
                  </TabButton>
                </div>
              </div>
            </div>

            {/* Always submitted, just hidden in preview — a controlled textarea
                unmounted mid-edit would drop the draft. */}
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={22}
              className={`${input} font-mono text-[13px] leading-relaxed ${
                tab === "preview" ? "hidden" : ""
              }`}
            />
            {tab === "preview" && (
              <div className="min-h-[28rem] rounded-xl border border-slate-200 bg-white p-6">
                {body.trim() ? (
                  <PostBody source={body} />
                ) : (
                  <p className="text-sm text-slate-400">Nothing to preview yet.</p>
                )}
              </div>
            )}
            {errors.body && <ErrorText>{errors.body[0]}</ErrorText>}
            <p className="mt-2 text-[11px] text-slate-400">
              Markdown. <code className="rounded bg-slate-100 px-1">## Heading</code> builds the
              table of contents. Wrap a highlighted note in{" "}
              <code className="rounded bg-slate-100 px-1">:::callout</code> …{" "}
              <code className="rounded bg-slate-100 px-1">:::</code>
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Publishing
            </p>
            <div className="space-y-3">
              <button
                type="submit"
                name="status"
                value="published"
                disabled={pending}
                className="w-full rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-50"
              >
                {pending ? "Saving…" : values.status === "published" ? "Update live post" : "Publish"}
              </button>
              <button
                type="submit"
                name="status"
                value="draft"
                disabled={pending}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {values.status === "published" ? "Unpublish (back to draft)" : "Save draft"}
              </button>
            </div>
            {!isNew && values.status === "published" && (
              <Link
                href={`/blog/${values.slug}`}
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-800 hover:text-brand-900"
              >
                View live post <FaArrowUpRightFromSquare className="text-[9px]" />
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Details
            </p>
            <div className="space-y-5">
              <Field label="Tags" error={errors.tags} hint="Comma separated, up to six.">
                <input
                  name="tags"
                  defaultValue={values.tags}
                  className={input}
                  placeholder="HRMS, Payroll"
                />
              </Field>
              <Field label="Author" error={errors.author}>
                <input name="author" defaultValue={values.author} className={input} />
              </Field>
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={values.featured}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Feature at the top of the blog
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Cover image
            </p>
            <CoverUpload value={coverUrl} onChange={setCoverUrl} error={errors.coverUrl?.[0]} />
            <div className="mt-4">
              <Field label="Alt text" error={errors.coverAlt} hint="Described for screen readers.">
                <input name="coverAlt" defaultValue={values.coverAlt} className={input} />
              </Field>
            </div>
          </div>


        </aside>
      </div>
    </form>
          {onDelete && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-rose-500">
                Danger zone
              </p>
              {onDelete}
            </div>
          )}
    </>
  );
}
