CREATE TABLE IF NOT EXISTS "insights" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"date" date,
	"description" varchar,
	"wikipedia_link" varchar,
	"views" numeric
);
