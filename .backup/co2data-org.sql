-- -------------------------------------------------------------
-- TablePlus 4.8.7(448)
--
-- https://tableplus.com/
--
-- Database: co2data-org
-- Generation Time: 2024-03-24 12:22:05.1570
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TYPE units AS ENUM ('kilometer', 'hour', 'gram', 'meter', 'kilogram', 'liter', 'minute');

CREATE TABLE `authenticators` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `credential_id` text NOT NULL,
  `credential_public_key` text NOT NULL,
  `counter` bigint NOT NULL,
  `credential_device_type` varchar(32) NOT NULL,
  `credential_backed_up` tinyint(1) NOT NULL,
  `user_id` UUID NOT NULL,
  `transports` json DEFAULT NULL,
  INDEX `index_authenticators_on_user_id` (`user_id`),
);

CREATE TABLE `categories` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `title` text NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
);



CREATE TABLE `co2_producers` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category_id` UUID NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` UUID NOT NULL,
  `unit` units NOT NULL,
  `single_consumption_from` double NOT NULL,
  `single_consumption_to` double NOT NULL,
  `single_consumption_average` double NOT NULL,
  `times_per_year_from` double NOT NULL,
  `times_per_year_to` double NOT NULL,
  `times_per_year_average` double NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  INDEX `category_id` (`category_id`)
);

CREATE TABLE `links` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `sources_id` UUID NOT NULL,
  `name` varchar(191) NOT NULL,
  `media_type` varchar(191) NOT NULL,
  `url` varchar(2000) NOT NULL,
  INDEX `links_sources_id_idx` (`sources_id`)
);

CREATE TABLE `sourced_co2_amounts` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `co2_producer_id` UUID NOT NULL,
  `source_id` UUID NOT NULL,
  `g_co2e` double NOT NULL,
  `per` double NOT NULL,
  `quote` text,
  `description` text NOT NULL,
  `user_id` UUID NOT NULL,
  `source_co2e_amount` double DEFAULT NULL,
  `source_co2e_unit` varchar(255) DEFAULT NULL,
  INDEX `sourced_co2_amounts_source_id_co2_producer_id_idx` (`source_id`,`co2_producer_id`)
);

CREATE TABLE `sources` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `co2_producer_id` UUID NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `user_id` UUID NOT NULL,
  `name` varchar(255) NOT NULL,
  INDEX `index_co2_producers` (`co2_producer_id`)
);

CREATE TABLE `users` (
  `id` UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  `username` varchar(255) NOT NULL,
  `current_callenge` varchar(255) DEFAULT NULL,
);

CREATE VIEW `co2_average` AS select `co2`.`id` AS `id`,`co2`.`title` AS `title`,`co2`.`description` AS `description`,`co2`.`slug` AS `slug`,`co2`.`unit` AS `unit`,cast(((`co2`.`single_consumption_average` * `co2`.`times_per_year_average`) * avg(`sourced_co2_amounts`.`g_co2e`)) as decimal(16,2)) AS `avg_per_year`,avg(`sourced_co2_amounts`.`g_co2e`) AS `avg_per_unit`,`co2`.`single_consumption_from` AS `single_consumption_from`,`co2`.`single_consumption_to` AS `single_consumption_to`,`co2`.`single_consumption_average` AS `single_consumption_average`,`co2`.`times_per_year_from` AS `times_per_year_from`,`co2`.`times_per_year_to` AS `times_per_year_to`,`co2`.`times_per_year_average` AS `times_per_year_average` from (`co2_producers` `co2` join `sourced_co2_amounts` on((`co2`.`id` = `sourced_co2_amounts`.`co2_producer_id`))) group by `sourced_co2_amounts`.`co2_producer_id`;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;