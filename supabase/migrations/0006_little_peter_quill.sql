DO $$ BEGIN
 CREATE TYPE "public"."logType" AS ENUM('ai.insights');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log" (
	"created" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_type" "logType",
	"log_message" varchar,
	"key" varchar,
	"data" jsonb
);
