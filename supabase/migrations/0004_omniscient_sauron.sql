ALTER TABLE "insights" ADD COLUMN "book_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insights" ADD CONSTRAINT "insights_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
