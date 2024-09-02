CREATE TABLE IF NOT EXISTS "notes" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"date" date,
	"year" numeric,
	"is_bc" boolean,
	"description" varchar,
	"book_id" uuid,
	"user_id" uuid,
	"insight_id" uuid
);
--> statement-breakpoint
ALTER TABLE "insights" ADD COLUMN "year" numeric;--> statement-breakpoint
ALTER TABLE "insights" ADD COLUMN "is_bc" boolean;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_insight_id_insights_id_fk" FOREIGN KEY ("insight_id") REFERENCES "public"."insights"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
