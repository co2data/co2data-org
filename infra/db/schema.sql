-- -------------------------------------------------------------
-- TablePlus 4.8.7(448)
--
-- https://tableplus.com/
--
-- Database: mydb
-- Generation Time: 2023-01-28 11:44:47.0900
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `categories` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `title` text NOT NULL,
  `slug` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `co2_producers` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(255) NOT NULL,
  `description` text,
  `category_id` char(36) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `unit` enum('kilometer','hour','gram','meter','kilogram','liter','minute') NOT NULL,
  `single_consumption_from` double NOT NULL,
  `single_consumption_to` double NOT NULL,
  `single_consumption_average` double NOT NULL,
  `times_per_year_from` double NOT NULL,
  `times_per_year_to` double NOT NULL,
  `times_per_year_average` double NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sources` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `co2_producer_id` char(36) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `g_co2e` double NOT NULL,
  `per` double NOT NULL,
  `description` text NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY index_co2_producers (co2_producer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE VIEW `co2_average` AS select `co2`.`title` AS `title`,`co2`.`slug` AS `slug`,`co2`.`unit` AS `unit`,((`co2`.`single_consumption_average` * `co2`.`times_per_year_average`) * avg(`sources`.`g_co2e`)) AS `avg_per_year`,avg(`sources`.`g_co2e`) AS `avg_per_unit` from (`co2_producers` `co2` join `sources` on((`co2`.`id` = `sources`.`co2_producer_id`))) group by `sources`.`co2_producer_id`;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;