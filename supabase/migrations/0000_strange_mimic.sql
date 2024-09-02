CREATE TABLE IF NOT EXISTS "book_for_user" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_user_id" uuid,
	"user_id" uuid,
	"book_id" uuid,
	"favorite" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar,
	"author" varchar,
	"isbn" varchar,
	"isbn13" varchar,
	"amazon_id" varchar,
	"description" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"goodreads_rating" numeric,
	"last_import" timestamp,
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn"),
	CONSTRAINT "books_isbn13_unique" UNIQUE("isbn13")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar,
	"location" varchar,
	"avatar_url" varchar,
	"latitude" numeric,
	"longitude" numeric,
	"supabase_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_for_user" ADD CONSTRAINT "book_for_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_for_user" ADD CONSTRAINT "book_for_user_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_book" ON "book_for_user" USING btree ("supabase_user_id","book_id");