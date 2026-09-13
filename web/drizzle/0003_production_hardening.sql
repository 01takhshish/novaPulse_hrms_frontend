CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "notification_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_until" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"last_error" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_jobs_lead_id_unique" UNIQUE("lead_id")
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "became_customer_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "previous_slugs" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_pages" ADD COLUMN "previous_slugs" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_jobs" ADD CONSTRAINT "notification_jobs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_jobs_due_idx" ON "notification_jobs" USING btree ("sent_at","next_attempt_at");
--> statement-breakpoint
UPDATE leads SET became_customer_at = updated_at WHERE status = 'won';

--> statement-breakpoint
INSERT INTO media_assets (url)
SELECT cover_url FROM posts WHERE cover_url LIKE 'https://%.public.blob.vercel-storage.com/%'
UNION SELECT image_src FROM service_pages WHERE image_src LIKE 'https://%.public.blob.vercel-storage.com/%'
ON CONFLICT (url) DO NOTHING;
