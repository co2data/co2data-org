CREATE TABLE `authenticators` (
	`id` text PRIMARY KEY NOT NULL,
	`credential_id` text NOT NULL,
	`credential_public_key` text NOT NULL,
	`counter` blob NOT NULL,
	`credential_device_type` text NOT NULL,
	`credential_backed_up` integer NOT NULL,
	`user_id` text NOT NULL,
	`transports` text
);
--> statement-breakpoint
CREATE INDEX `index_authenticators_on_user_id` ON `authenticators` (`user_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `co2_producers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`category_id` text NOT NULL,
	`image` text(255),
	`user_id` text NOT NULL,
	`unit` text NOT NULL,
	`single_consumption_from` real NOT NULL,
	`single_consumption_to` real NOT NULL,
	`single_consumption_average` real NOT NULL,
	`times_per_year_from` real NOT NULL,
	`times_per_year_to` real NOT NULL,
	`times_per_year_average` real NOT NULL,
	`slug` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `co2_producers_slug_unique` ON `co2_producers` (`slug`);--> statement-breakpoint
CREATE INDEX `category_id` ON `co2_producers` (`category_id`);--> statement-breakpoint
CREATE TABLE `links` (
	`id` text PRIMARY KEY NOT NULL,
	`sources_id` text NOT NULL,
	`name` text(191) NOT NULL,
	`media_type` text(191) NOT NULL,
	`url` text(2000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `links_sources_id_idx` ON `links` (`sources_id`);--> statement-breakpoint
CREATE TABLE `sourced_co2_amounts` (
	`id` text PRIMARY KEY NOT NULL,
	`co2_producer_id` text NOT NULL,
	`source_id` text NOT NULL,
	`g_co2e` real NOT NULL,
	`per` real NOT NULL,
	`quote` text,
	`description` text NOT NULL,
	`user_id` text NOT NULL,
	`source_co2e_amount` real,
	`source_co2e_unit` text(255)
);
--> statement-breakpoint
CREATE INDEX `sourced_co2_amounts_source_id_co2_producer_id_idx` ON `sourced_co2_amounts` (`co2_producer_id`,`source_id`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`co2_producer_id` text NOT NULL,
	`region` text(255),
	`year` integer,
	`user_id` text NOT NULL,
	`name` text(255) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `index_co2_producer_id` ON `sources` (`co2_producer_id`);--> statement-breakpoint
CREATE INDEX `index_user_id` ON `sources` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text(255) NOT NULL,
	`current_challenge` text(255)
);
--> statement-breakpoint
CREATE VIEW `co2_average` AS SELECT co2.id,
    co2.title,
    co2.description,
    co2.slug,
    co2.unit,
    (co2.single_consumption_average * co2.times_per_year_average * avg(sourced_co2_amounts.g_co2e)) AS avg_per_year,
    avg(sourced_co2_amounts.g_co2e) AS avg_per_unit,
    co2.single_consumption_from,
    co2.single_consumption_to,
    co2.single_consumption_average,
    co2.times_per_year_from,
    co2.times_per_year_to,
    co2.times_per_year_average
   FROM co2_producers co2
     JOIN sourced_co2_amounts ON co2.id = sourced_co2_amounts.co2_producer_id
  GROUP BY sourced_co2_amounts.co2_producer_id, co2.id, co2.title, co2.description, co2.slug, co2.unit, co2.single_consumption_to, co2.single_consumption_from, co2.single_consumption_average, co2.times_per_year_from, co2.times_per_year_to, co2.times_per_year_average;;
