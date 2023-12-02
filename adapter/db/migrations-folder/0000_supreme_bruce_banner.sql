CREATE TABLE `categories` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`title` text NOT NULL,
	`slug` varchar(255) NOT NULL DEFAULT ''
);

CREATE TABLE `co2_producers` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`title` varchar(255) NOT NULL,
	`description` text,
	`category_id` char(36) NOT NULL,
	`image` varchar(255),
	`user_id` char(36) NOT NULL,
	`unit` enum('kilometer','hour','gram','meter','kilogram','liter','minute') NOT NULL,
	`single_consumption_from` double NOT NULL,
	`single_consumption_to` double NOT NULL,
	`single_consumption_average` double NOT NULL,
	`times_per_year_from` double NOT NULL,
	`times_per_year_to` double NOT NULL,
	`times_per_year_average` double NOT NULL,
	`slug` varchar(255) NOT NULL
);

CREATE TABLE `links` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`sources_id` char(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`media_type` varchar(191) NOT NULL,
	`url` varchar(2000) NOT NULL
);

CREATE TABLE `sourced_co2_amounts` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`co2_producer_id` char(36) NOT NULL,
	`source_id` char(36) NOT NULL,
	`g_co2e` double NOT NULL,
	`per` double NOT NULL,
	`quote` text,
	`description` text NOT NULL,
	`user_id` char(36) NOT NULL,
	`source_co2e_amount` double,
	`source_co2e_unit` varchar(255)
);

CREATE TABLE `sources` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`co2_producer_id` char(36) NOT NULL,
	`region` varchar(255),
	`year` int,
	`user_id` char(36) NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT ''
);

CREATE TABLE `users` (
	`id` char(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`locked_at` timestamp,
	`failed_login_attempts` int NOT NULL DEFAULT 0
);

CREATE INDEX `category_id` ON `co2_producers` (`category_id`);
CREATE INDEX `links_sources_id_idx` ON `links` (`sources_id`);
CREATE INDEX `sourced_co2_amounts_source_id_co2_producer_id_idx` ON `sourced_co2_amounts` (`source_id`,`co2_producer_id`);
CREATE INDEX `index_co2_producers` ON `sources` (`co2_producer_id`);