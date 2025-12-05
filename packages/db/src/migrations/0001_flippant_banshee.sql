CREATE TABLE "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"place_slug" text NOT NULL,
	"place_name" text NOT NULL,
	"place_location" text NOT NULL,
	"destination_type" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"booking_date" timestamp DEFAULT now() NOT NULL,
	"visit_date" timestamp,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"total_members" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_member" ADD CONSTRAINT "booking_member_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;