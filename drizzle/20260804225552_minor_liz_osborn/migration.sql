CREATE TABLE "links" (
	"id" bigserial PRIMARY KEY,
	"short_code" varchar(64) NOT NULL,
	"url" text NOT NULL,
	"clerk_user_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"meta" jsonb
);
