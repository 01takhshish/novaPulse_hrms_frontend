CREATE TYPE "public"."service_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "service_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(140) NOT NULL,
	"name" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"eyebrow" varchar(120) NOT NULL,
	"tagline" varchar(320) NOT NULL,
	"description" varchar(320) NOT NULL,
	"menu_blurb" varchar(80) NOT NULL,
	"icon" varchar(60) NOT NULL,
	"illustration" varchar(60) NOT NULL,
	"image_src" text,
	"image_alt" varchar(200),
	"demo_service" "lead_service" DEFAULT 'General Inquiry' NOT NULL,
	"problems" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"process" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faqs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "service_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "service_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "service_pages_status_sort_order_idx" ON "service_pages" USING btree ("status","sort_order");