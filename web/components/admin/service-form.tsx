"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { CoverUpload } from "@/components/admin/cover-upload";
import { ErrorText, Field, input, labelText, Panel } from "@/components/admin/fields";
import { Repeatable } from "@/components/admin/repeatable";
import { slugify } from "@/lib/blog/derive";
import { saveServiceAction, type ServiceFormState } from "@/lib/services/actions";
import { iconNames, illustrationNames } from "@/lib/services/registry";
import { services as demoServices } from "@/lib/site";

type Section = { title: string; body: string };
type Capability = { icon: string; title: string; body: string };
/** `value` and `decimals` stay strings while being typed; see `serializeStats`. */
type StatDraft = {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
  decimals: string;
};
type Faq = { question: string; answer: string };

export type ServiceFormValues = {
  id?: string;
  slug: string;
  name: string;
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  menuBlurb: string;
  icon: string;
  illustration: string;
  imageSrc: string;
  imageAlt: string;
  demoService: string;
  problems: Section[];
  capabilities: Capability[];
  stats: StatDraft[];
  process: Section[];
  faqs: Faq[];
  related: string[];
  sortOrder: number;
  status: "draft" | "published";
};

const EMPTY: ServiceFormState = {};

/**
 * The server echoes rejected submissions back with the repeating sections as
 * JSON strings, since that is how they crossed the wire. Anything unreadable
 * falls back to what the page was rendered with rather than blanking the
 * section — the author's other edits are still on screen and worth keeping.
 */
function rehydrate<T>(raw: string | undefined, fallback: T[]): T[] {
  if (raw === undefined) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/** "" stays out of the payload entirely, so Zod sees `undefined`, not NaN. */
function serializeStats(rows: StatDraft[]) {
  return rows.map((row) => ({
    value: row.value.trim() === "" ? Number.NaN : Number(row.value),
    label: row.label,
    prefix: row.prefix.trim() || undefined,
    suffix: row.suffix.trim() || undefined,
    decimals: row.decimals.trim() === "" ? undefined : Number(row.decimals),
  }));
}

export function ServiceForm({
  initial,
  siblings,
  onDelete,
}: {
  initial: ServiceFormValues;
  /** Every other service, for the related-services picker. */
  siblings: { slug: string; name: string; status: string }[];
  onDelete?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(saveServiceAction, EMPTY);
  const echoed = state.values ?? {};

  const values = { ...initial, ...echoed } as unknown as ServiceFormValues;
  const errors = state.fieldErrors ?? {};
  const isNew = !initial.id;

  const [name, setName] = useState(String(values.name ?? ""));
  const [slug, setSlug] = useState(String(values.slug ?? ""));
  const [imageSrc, setImageSrc] = useState(String(values.imageSrc ?? ""));
  const [problems, setProblems] = useState<Section[]>(
    rehydrate(echoed.problems, initial.problems),
  );
  const [capabilities, setCapabilities] = useState<Capability[]>(
    rehydrate(echoed.capabilities, initial.capabilities),
  );
  const [stats, setStats] = useState<StatDraft[]>(rehydrate(echoed.stats, initial.stats));
  const [process, setProcess] = useState<Section[]>(
    rehydrate(echoed.process, initial.process),
  );
  const [faqs, setFaqs] = useState<Faq[]>(rehydrate(echoed.faqs, initial.faqs));
  const [related, setRelated] = useState<string[]>(
    rehydrate(echoed.related, initial.related),
  );

  // Only a brand-new service follows the name. Once published, the slug is a
  // live URL and silently changing it would break every inbound link.
  const slugTouched = useRef(!isNew);
  useEffect(() => {
    if (!slugTouched.current) setSlug(slugify(name));
  }, [name]);

  return (
    <>
    <form action={formAction} className="space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="related" value={JSON.stringify(related)} />

      {state.message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            state.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="The page">
            <div className="space-y-5">
              <Field label="Name" error={errors.name} hint="The short label used in the menu and on cards.">
                <input
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={input}
                  placeholder="HRMS & Payroll"
                  required
                />
              </Field>

              <Field label="Slug" error={errors.slug} hint={`novapulse.co.in/services/${slug || "…"}`}>
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

              <Field label="Eyebrow" error={errors.eyebrow} hint="The small line above the page title.">
                <input
                  name="eyebrow"
                  defaultValue={values.eyebrow}
                  className={input}
                  placeholder="Flagship platform"
                  required
                />
              </Field>

              <Field label="Title" error={errors.title}>
                <input
                  name="title"
                  defaultValue={values.title}
                  className={input}
                  placeholder="HRMS & Payroll Software"
                  required
                />
              </Field>

              <Field label="Tagline" error={errors.tagline} hint="One line under the title.">
                <textarea name="tagline" defaultValue={values.tagline} rows={2} className={input} required />
              </Field>

              <Field
                label="Description"
                error={errors.description}
                hint="The meta description in search results, and the blurb on /services."
              >
                <textarea
                  name="description"
                  defaultValue={values.description}
                  rows={3}
                  className={input}
                  required
                />
              </Field>

              <Field
                label="Menu blurb"
                error={errors.menuBlurb}
                hint="The line under the name in the header dropdown. Keep it short."
              >
                <input
                  name="menuBlurb"
                  defaultValue={values.menuBlurb}
                  className={input}
                  placeholder="Attendance, Shifts & Payroll"
                  required
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Problems it solves">
            <Repeatable
              name="problems"
              label="Problems"
              max={8}
              rows={problems}
              onChange={setProblems}
              blank={() => ({ title: "", body: "" })}
              error={errors.problems}
              summary={(row) => row.title}
            >
              {(row, set) => (
                <>
                  <input
                    value={row.title}
                    onChange={(event) => set({ title: event.target.value })}
                    className={input}
                    placeholder="Month-end takes three days"
                    aria-label="Problem title"
                  />
                  <textarea
                    value={row.body}
                    onChange={(event) => set({ body: event.target.value })}
                    rows={2}
                    className={input}
                    placeholder="What goes wrong today, in a sentence or two."
                    aria-label="Problem detail"
                  />
                </>
              )}
            </Repeatable>
          </Panel>

          <Panel title="Capabilities">
            <Repeatable
              name="capabilities"
              label="Capabilities"
              max={12}
              rows={capabilities}
              onChange={setCapabilities}
              blank={() => ({ icon: iconNames[0], title: "", body: "" })}
              error={errors.capabilities}
              hint="A published service page needs at least one."
              summary={(row) => row.title}
            >
              {(row, set) => (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
                    <select
                      value={row.icon}
                      onChange={(event) => set({ icon: event.target.value })}
                      className={input}
                      aria-label="Capability icon"
                    >
                      {iconNames.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon.replace(/^Fa/, "")}
                        </option>
                      ))}
                    </select>
                    <input
                      value={row.title}
                      onChange={(event) => set({ title: event.target.value })}
                      className={input}
                      placeholder="Statutory payroll"
                      aria-label="Capability title"
                    />
                  </div>
                  <textarea
                    value={row.body}
                    onChange={(event) => set({ body: event.target.value })}
                    rows={2}
                    className={input}
                    aria-label="Capability detail"
                  />
                </>
              )}
            </Repeatable>
          </Panel>

          <Panel title="How it works">
            <Repeatable
              name="process"
              label="Steps"
              max={8}
              rows={process}
              onChange={setProcess}
              blank={() => ({ title: "", body: "" })}
              error={errors.process}
              summary={(row) => row.title}
            >
              {(row, set) => (
                <>
                  <input
                    value={row.title}
                    onChange={(event) => set({ title: event.target.value })}
                    className={input}
                    placeholder="Discovery call"
                    aria-label="Step title"
                  />
                  <textarea
                    value={row.body}
                    onChange={(event) => set({ body: event.target.value })}
                    rows={2}
                    className={input}
                    aria-label="Step detail"
                  />
                </>
              )}
            </Repeatable>
          </Panel>

          <Panel title="FAQs">
            <Repeatable
              name="faqs"
              label="Questions"
              max={12}
              rows={faqs}
              onChange={setFaqs}
              blank={() => ({ question: "", answer: "" })}
              error={errors.faqs}
              summary={(row) => row.question}
            >
              {(row, set) => (
                <>
                  <input
                    value={row.question}
                    onChange={(event) => set({ question: event.target.value })}
                    className={input}
                    placeholder="Do you support multiple locations?"
                    aria-label="Question"
                  />
                  <textarea
                    value={row.answer}
                    onChange={(event) => set({ answer: event.target.value })}
                    rows={3}
                    className={input}
                    aria-label="Answer"
                  />
                </>
              )}
            </Repeatable>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel title="Publishing">
            <div className="space-y-3">
              <button
                type="submit"
                name="status"
                value="published"
                disabled={pending}
                className="w-full rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-50"
              >
                {pending
                  ? "Saving…"
                  : values.status === "published"
                    ? "Update live page"
                    : "Publish"}
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
                href={`/services/${values.slug}`}
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-800 hover:text-brand-900"
              >
                View live page <FaArrowUpRightFromSquare className="text-[9px]" />
              </Link>
            )}
            <p className="mt-4 text-[11px] text-slate-400">
              Publishing refreshes the header menu on every page, so it can take a moment
              longer than a blog post.
            </p>
          </Panel>

          <Panel title="Appearance">
            <div className="space-y-5">
              <Field label="Icon" error={errors.icon} hint="Used in the menu and on the services grid.">
                <select name="icon" defaultValue={values.icon} className={input} required>
                  {iconNames.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon.replace(/^Fa/, "")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Illustration"
                error={errors.illustration}
                hint="The hero scene, used when there is no photo."
              >
                <select
                  name="illustration"
                  defaultValue={values.illustration}
                  className={input}
                  required
                >
                  {illustrationNames.map((illustration) => (
                    <option key={illustration} value={illustration}>
                      {illustration.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Hero photo">
            <CoverUpload value={imageSrc} onChange={setImageSrc} error={errors.imageSrc?.[0]} />
            <input type="hidden" name="imageSrc" value={imageSrc} />
            <div className="mt-4">
              <Field label="Alt text" error={errors.imageAlt} hint="Described for screen readers.">
                <input name="imageAlt" defaultValue={values.imageAlt} className={input} />
              </Field>
            </div>
          </Panel>

          <Panel title="Stat band">
            <Repeatable
              name="stats"
              label="Stats"
              max={4}
              rows={stats}
              onChange={setStats}
              serialize={serializeStats}
              blank={() => ({ value: "", label: "", prefix: "", suffix: "", decimals: "" })}
              error={errors.stats}
              hint="Structural facts — how many stages, how many device types — not performance claims."
              summary={(row) => row.label}
            >
              {(row, set) => (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={row.prefix}
                      onChange={(event) => set({ prefix: event.target.value })}
                      className={input}
                      placeholder="₹"
                      aria-label="Stat prefix"
                    />
                    <input
                      value={row.value}
                      onChange={(event) => set({ value: event.target.value })}
                      className={input}
                      inputMode="decimal"
                      placeholder="6"
                      aria-label="Stat value"
                    />
                    <input
                      value={row.suffix}
                      onChange={(event) => set({ suffix: event.target.value })}
                      className={input}
                      placeholder="+"
                      aria-label="Stat suffix"
                    />
                  </div>
                  <input
                    value={row.label}
                    onChange={(event) => set({ label: event.target.value })}
                    className={input}
                    placeholder="stages from punch to payslip"
                    aria-label="Stat label"
                  />
                  <select
                    value={row.decimals}
                    onChange={(event) => set({ decimals: event.target.value })}
                    className={input}
                    aria-label="Stat decimal places"
                  >
                    <option value="">No decimals</option>
                    <option value="1">1 decimal place</option>
                    <option value="2">2 decimal places</option>
                  </select>
                </>
              )}
            </Repeatable>
          </Panel>

          <Panel title="Wiring">
            <div className="space-y-5">
              <Field
                label="Demo form service"
                error={errors.demoService}
                hint="Preselected when someone books a demo from this page."
              >
                <select
                  name="demoService"
                  defaultValue={values.demoService}
                  className={input}
                  required
                >
                  {demoServices.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <span className={labelText}>Related services</span>
                <div className="mt-1.5 space-y-1.5">
                  {siblings.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      Nothing to link to yet — create another service first.
                    </p>
                  ) : (
                    siblings.map((sibling) => (
                      <label key={sibling.slug} className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={related.includes(sibling.slug)}
                          onChange={(event) =>
                            setRelated((current) =>
                              event.target.checked
                                ? [...current, sibling.slug]
                                : current.filter((slug) => slug !== sibling.slug),
                            )
                          }
                          className="mt-0.5 h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {sibling.name}
                          {sibling.status === "draft" && (
                            <span className="ml-1.5 text-[10px] font-bold uppercase text-amber-600">
                              draft
                            </span>
                          )}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {errors.related && <ErrorText>{errors.related[0]}</ErrorText>}
              </div>

              <Field
                label="Menu order"
                error={errors.sortOrder}
                hint="Lower numbers come first in the header and on /services."
              >
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={values.sortOrder}
                  className={input}
                />
              </Field>
            </div>
          </Panel>


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
