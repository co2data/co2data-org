-- -------------------------------------------------------------
-- TablePlus 4.8.7(448)
--
-- https://tableplus.com/
--
-- Database: co2data-org
-- Generation Time: 2023-08-06 17:19:41.9450
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

CREATE TABLE `links` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `sources_id` char(36) NOT NULL,
  `name` varchar(191) NOT NULL,
  `media_type` varchar(191) NOT NULL,
  `url` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `links_sources_id_idx` (`sources_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sourced_co2_amounts` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `co2_producer_id` char(36) NOT NULL,
  `source_id` char(36) NOT NULL,
  `g_co2e` double NOT NULL,
  `per` double NOT NULL,
  `quote` text,
  `description` text NOT NULL,
  `user_id` char(36) NOT NULL,
  `source_co2e_amount` double DEFAULT NULL,
  `source_co2e_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sourced_co2_amounts_source_id_co2_producer_id_idx` (`source_id`,`co2_producer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sources` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `co2_producer_id` char(36) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `index_co2_producers` (`co2_producer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categories` (`id`, `title`, `slug`) VALUES
('092a5cd4-1f4f-4db4-b79c-918dc7fdca2d', 'Buildings', 'buildings'),
('64ac4651-062b-47db-ae5f-9929dc73950d', 'Agriculture', 'agriculture'),
('b0871cb0-3e77-4b90-812e-006106af8a84', 'Electricity', 'electricity'),
('d20e8aa8-384e-405a-90a2-bf30554bf9bb', 'Transportation', 'transportation'),
('dc1695e9-b616-41f4-9c76-84394fea5700', 'Industry', 'industry');

INSERT INTO `co2_producers` (`id`, `title`, `description`, `category_id`, `image`, `user_id`, `unit`, `single_consumption_from`, `single_consumption_to`, `single_consumption_average`, `times_per_year_from`, `times_per_year_to`, `times_per_year_average`, `slug`) VALUES
('05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Gasoline', NULL, 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 100, 40, 0, 100, 62, 'gasoline'),
('1651c48c-2c7e-11ee-ace3-1a6083480995', 'Brassicas', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.6, 0.1, 0, 300, 20, 'brassicas'),
('258aaa11-a891-4f9a-b29b-67086edd53e6', 'Pork', 'Pig meat', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 300, 100, 'pork'),
('2a3fd46e-f20d-4961-a89e-11b9236448e4', 'Poultry Meat', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 300, 50, 'poultry-meat'),
('339e10e7-2c80-11ee-ace3-1a6083480995', 'Onions', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.2, 0.004, 0, 600, 200, 'onions'),
('34669972-a53e-4bee-a2cc-2c8414014a39', 'Tofu', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.1, 0, 100, 1, 'tofu'),
('3570f84b-fcc7-45c5-b415-ec19a56c77ea', 'Nuts', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 100, 20, 'nuts'),
('3fcf0a84-a438-440c-bb90-1221907caa8a', 'Beef (dairy herd)', 'Beef from dairy herd.', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 360, 120, 'beef-dairy-herd'),
('4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'LED Lightbulb (7W)', NULL, 'b0871cb0-3e77-4b90-812e-006106af8a84', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'hour', 0, 24, 8, 0, 365, 200, 'led-lightbulb-7w'),
('5383ded5-2d18-11ee-ace3-1a6083480995', 'Bananas', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.12, 0, 300, 30, 'bananas'),
('563addb6-2c74-11ee-ace3-1a6083480995', 'Rapeseed Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 300, 45, 'rapeseed-oil'),
('67ac058e-4156-404e-8933-fa43e950550c', 'Shower', NULL, '092a5cd4-1f4f-4db4-b79c-918dc7fdca2d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'minute', 0, 15, 6, 0, 600, 210, 'shower'),
('684b6b08-8b7d-4012-b24b-fafc7464a510', 'Ferry', NULL, 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilometer', 0, 1000, 10, 0, 100, 2, 'ferry'),
('6b09a28e-2d19-11ee-ace3-1a6083480995', 'Apples', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 600, 60, 'apples'),
('7e7363d7-458a-45c9-8158-845628aab7eb', 'Cheese', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.2, 0.02, 0, 300, 20, 'cheese'),
('83eb3a34-2d17-11ee-ace3-1a6083480995', 'Berries', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 300, 30, 'berries'),
('8ade21c7-64e5-4c36-9308-7414c826f73f', 'Soymilk', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 1, 0.2, 0, 300, 6, 'soymilk'),
('95a12fea-124f-4c05-a0a2-ba5faa4adb9a', 'Olive Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 300, 45, 'olive-oil'),
('967ba5e9-2c81-11ee-ace3-1a6083480995', 'Root Vegetables', 'Carrots, taro corms, ginger rhizomes, turnips', '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.4, 0.1, 0, 300, 50, 'root-vegetables'),
('ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', 'Lamb Meat', 'Lamb meat', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 100, 20, 'lamb-meat'),
('b2359d0a-2c80-11ee-ace3-1a6083480995', 'Leeks', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.2, 0.004, 0, 200, 20, 'leeks'),
('ba7ba10c-fd19-48e7-a606-8941f34775df', 'Milk', 'Dairy milk', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 1, 0.2, 0, 600, 200, 'milk'),
('c72452c9-d4cb-4a9b-8a99-113ee7c24dc5', 'Soybean Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 1000, 600, 'soybean-oil'),
('c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Beef (beef herd)', 'Beef from the specialized beef herds.', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 360, 120, 'beef-beef-herd'),
('d8bcad6a-77a3-4ce6-8d4f-aee796e35117', 'Peanuts', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 100, 20, 'peanuts'),
('d9e9f7c1-ba53-4477-8a8f-74ea39c4d631', 'Fish (farmed)', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 300, 50, 'fish-farmed'),
('dc70a896-b475-4c0a-b8d2-d0db382cd3c4', 'Eggs', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 300, 50, 'eggs'),
('dec50cfb-2d19-11ee-ace3-1a6083480995', 'Citrus', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 600, 60, 'citrus'),
('ea4c7dbd-2c7b-11ee-ace3-1a6083480995', 'Tomatoes', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.6, 0.1, 0, 300, 50, 'tomatoes'),
('eb71fed0-ca8b-4dfd-a201-0ae62150bc61', 'Peas', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.1, 0, 100, 10, 'peas'),
('f15cbee6-2c7a-11ee-ace3-1a6083480995', 'Sunflower Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 300, 45, 'sunflower-oil'),
('f71d3153-3746-44f1-bc0b-0a7d92565efe', 'Grains', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 1000, 500, 'grains'),
('f8f07a6e-f98e-43ee-b56e-49b551441179', 'Palm Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 1600, 800, 'palm-oil');

INSERT INTO `links` (`id`, `sources_id`, `name`, `media_type`, `url`) VALUES
('1eae2eb0-2c64-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Results', 'application/vnd.ms-excel', 'https://josephpoore.com/Data%20S2.xls'),
('6490ea66-2c5e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Author webpage', 'text/html', 'https://josephpoore.com/'),
('c62741e3-2c5e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Science Journals article', 'application/pdf', 'https://josephpoore.com/Poore%20and%20Nemecek%20(2018)%20Reducing%20foods%20environmental%20impacts%20through%20producers%20and%20consumers.pdf#page=2'),
('d9113800-2c63-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Full database', 'text/html', 'https://ora.ox.ac.uk/objects/uuid:a63fb28c-98f8-4313-add6-e9eca99320a5');

INSERT INTO `sourced_co2_amounts` (`id`, `co2_producer_id`, `source_id`, `g_co2e`, `per`, `quote`, `description`, `user_id`, `source_co2e_amount`, `source_co2e_unit`) VALUES
('05b2f196-2d1a-11ee-ace3-1a6083480995', 'dec50cfb-2d19-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg citrus mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('2b8b9d91-d5e2-11ed-9416-de741d4b6ce8', 'dc70a896-b475-4c0a-b8d2-d0db382cd3c4', '083cab84-b0fb-47a0-8e42-001860395395', 42000, 1, NULL, '100g protein from eggs mean 4.2 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b8d837c-d5e2-11ed-9416-de741d4b6ce8', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', '1488d81e-80a9-496e-884b-76da03592ee9', 3, 1, NULL, '[eia.gov](https://www.eia.gov/tools/faqs/faq.php?id=74&t=11#:~:text=This%20equaled%20about%200.92%20pounds%20of%20CO2%20emissions%20per%20kWh)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b8f676e-d5e2-11ed-9416-de741d4b6ce8', '95a12fea-124f-4c05-a0a2-ba5faa4adb9a', '083cab84-b0fb-47a0-8e42-001860395395', 5400, 1, NULL, '1 liter from olive oil mean 5.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b914117-d5e2-11ed-9416-de741d4b6ce8', '3fcf0a84-a438-440c-bb90-1221907caa8a', '24731ab3-aa70-41d8-9a89-bd9215a5a081', 18400, 1, NULL, 'the carbon intensity of beef from the specialized beef herds is almost \nfourfold that produced from the dairy herd (67.8 vs. 18.4 kg CO2-eq per kg carcass weight). \n\n[fao.org](https://www.fao.org/3/i3461e/i3461e03.pdf)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b934e57-d5e2-11ed-9416-de741d4b6ce8', 'c72452c9-d4cb-4a9b-8a99-113ee7c24dc5', '083cab84-b0fb-47a0-8e42-001860395395', 6300, 1, NULL, '1 liter from soybean oil mean 6.3 kg CO2 eq.\n\n[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)\n[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b9524ec-d5e2-11ed-9416-de741d4b6ce8', 'f71d3153-3746-44f1-bc0b-0a7d92565efe', '083cab84-b0fb-47a0-8e42-001860395395', 27000, 1, NULL, '100g protein from grains mean 2.7 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b96eee8-d5e2-11ed-9416-de741d4b6ce8', 'ba7ba10c-fd19-48e7-a606-8941f34775df', '083cab84-b0fb-47a0-8e42-001860395395', 3200, 1, NULL, '1liter milk mean 3.2 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b98c1b9-d5e2-11ed-9416-de741d4b6ce8', '7e7363d7-458a-45c9-8158-845628aab7eb', '083cab84-b0fb-47a0-8e42-001860395395', 110000, 1, NULL, '100g protein from cheese mean 11 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b9a8cf1-d5e2-11ed-9416-de741d4b6ce8', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', '48e02428-dbd8-4f88-8df1-63515c28828d', 300000, 1, NULL, 'Emission intensities (i.e. emissions per unit of product) vary from commodity to commodity. They are highest for beef (almost 300 kg CO2-eq per kilogram of protein produced), followed by meat and milk from small ruminants (165 and 112kg CO2-eq.kg respectively)\n\n[fao.org](https://www.fao.org/news/story/en/item/197623/icode/)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b9c54eb-d5e2-11ed-9416-de741d4b6ce8', '258aaa11-a891-4f9a-b29b-67086edd53e6', '083cab84-b0fb-47a0-8e42-001860395395', 76000, 1, NULL, '100g protein from pig meat mean 7.6 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2b9e7ab6-d5e2-11ed-9416-de741d4b6ce8', '67ac058e-4156-404e-8933-fa43e950550c', '554bc400-2769-4dca-b113-35c09afebd3b', 115.4, 1, NULL, '[PDF](https://www.waterwise.org.uk/wp-content/uploads/2018/02/Energy-Saving-Trust-2009_Quantifying-the-Energy-and-Carbon-Effects-of-Water-Saving_Full-Technical-Report.pdf)\n\nStandard assumptions \n- Occupancy 2.4 person \n- Building floor area 84 m2\n- System boiler with 12m primary pipe work and 120 litre cylinder with 25mm foam insulation.  \n- Hot water storage temperature 55°C3\n- Cold water feed 13°C \n- Mains water embodied carbon 0.75 kg CO2e/m3\n- 28m of 15mm hot water pipe work\n- Shower 7 litres/min \n- 0.59 showers per person per day\n- 25.7l per shower\n- Annually 89kg CO₂ per household\n\n89kg CO2 ÷ (25.7l × 0.59sw/p/d × 365d ÷ 7l/min) = 0.1154 kg CO2 per min\n\n', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba04e81-d5e2-11ed-9416-de741d4b6ce8', 'eb71fed0-ca8b-4dfd-a201-0ae62150bc61', '083cab84-b0fb-47a0-8e42-001860395395', 4000, 1, NULL, '100g protein from peas mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba2250d-d5e2-11ed-9416-de741d4b6ce8', 'ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', '083cab84-b0fb-47a0-8e42-001860395395', 200000, 1, NULL, '100g protein lamb & mutton mean 20 kg CO2 eq.  ', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba3e83e-d5e2-11ed-9416-de741d4b6ce8', '8ade21c7-64e5-4c36-9308-7414c826f73f', '083cab84-b0fb-47a0-8e42-001860395395', 1000, 1, NULL, '1 liter soymilk mean 1.0 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba5b14f-d5e2-11ed-9416-de741d4b6ce8', 'd8bcad6a-77a3-4ce6-8d4f-aee796e35117', '083cab84-b0fb-47a0-8e42-001860395395', 12000, 1, NULL, '100g protein from peanuts mean 1.2 kg CO2 eq. ', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba776b4-d5e2-11ed-9416-de741d4b6ce8', 'd9e9f7c1-ba53-4477-8a8f-74ea39c4d631', '083cab84-b0fb-47a0-8e42-001860395395', 60000, 1, NULL, '100g protein from fish (farmed) mean 6 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2ba93eb9-d5e2-11ed-9416-de741d4b6ce8', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'a2268f70-d29c-482b-b320-3abf2ab52665', 1, 1, NULL, '[bafu.admin.ch](https://www.bafu.admin.ch/bafu/de/home/themen/klima/fragen-antworten.html#:~:text=Die%20Kennzahlen%20f%C3%BCr%20die%20verschiedenen,Strommix%3A%2015.7%20g%20CO2eq%2FkWh)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bab055a-d5e2-11ed-9416-de741d4b6ce8', 'f8f07a6e-f98e-43ee-b56e-49b551441179', '083cab84-b0fb-47a0-8e42-001860395395', 7300, 1, NULL, '1 liter from palm oil mean 7.3 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bacd1d1-d5e2-11ed-9416-de741d4b6ce8', '05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'c6efc062-36c3-43ce-8408-30ede05bd8ca', 2312, 1, NULL, '[nrcan.gc.ca](https://www.nrcan.gc.ca/sites/www.nrcan.gc.ca/files/oee/pdf/transportation/fuel-efficient-technologies/autosmart_factsheet_6_e.pdf)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2baea874-d5e2-11ed-9416-de741d4b6ce8', '3570f84b-fcc7-45c5-b415-ec19a56c77ea', '083cab84-b0fb-47a0-8e42-001860395395', 3000, 1, NULL, '100g protein from nuts mean 0.3 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb06589-d5e2-11ed-9416-de741d4b6ce8', '3fcf0a84-a438-440c-bb90-1221907caa8a', '083cab84-b0fb-47a0-8e42-001860395395', 170000, 1, NULL, '100g protein from beef (dairy herd) mean 17 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb24824-d5e2-11ed-9416-de741d4b6ce8', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', '083cab84-b0fb-47a0-8e42-001860395395', 500000, 1, NULL, '100g protein from beef (beef herd) mean 50 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb41a38-d5e2-11ed-9416-de741d4b6ce8', '34669972-a53e-4bee-a2cc-2c8414014a39', '083cab84-b0fb-47a0-8e42-001860395395', 20000, 1, NULL, '100g protein from tofu mean 2.0 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb5e145-d5e2-11ed-9416-de741d4b6ce8', '2a3fd46e-f20d-4961-a89e-11b9236448e4', '083cab84-b0fb-47a0-8e42-001860395395', 57000, 1, NULL, '100g protein from poultry meat mean 5.7 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb7ab8e-d5e2-11ed-9416-de741d4b6ce8', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'f2080f15-f195-4661-b0fb-7a5c4bbb7f2d', 67600, 1, NULL, '67,6kg CO2-eq/kg product of beef (carcass weight and does not include post-harvest emissions.) \n\n[fao.org (PDF)](https://www.fao.org/3/i3437e/i3437e.pdf) Page 24', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('2bb9716f-d5e2-11ed-9416-de741d4b6ce8', '684b6b08-8b7d-4012-b24b-fafc7464a510', 'fbf38fe8-5591-4ff5-b166-258a2c928a5e', 112.86, 1, NULL, '[Excel](<https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020#:~:text=Conversion%20factors%202020:%20condensed%20set%20(for%20most%20users)>) Sheet Business travel- sea', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('35f34507-2c7c-11ee-ace3-1a6083480995', 'ea4c7dbd-2c7b-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 2100, 1, NULL, '1 kg tomatoes mean 2.1 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 2.1, 'kg'),
('36c52730-2c75-11ee-ace3-1a6083480995', '563addb6-2c74-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 3800, 1, NULL, '1 liter from rapeseed oil mean 3.8 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 3.8, 'kg'),
('506d85b8-2c7b-11ee-ace3-1a6083480995', 'f15cbee6-2c7a-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 3600, 1, NULL, '1 liter from sunflower oil mean 3.6 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 3.6, 'kg'),
('54e58dfe-2c80-11ee-ace3-1a6083480995', '339e10e7-2c80-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg onions mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg'),
('5c523dee-2c7e-11ee-ace3-1a6083480995', '1651c48c-2c7e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg brassicas mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg'),
('79a6cc7c-2d18-11ee-ace3-1a6083480995', '5383ded5-2d18-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 900, 1, NULL, '1 kg bananas mean 0.9 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.9, 'kg'),
('96bd0ace-2d19-11ee-ace3-1a6083480995', '6b09a28e-2d19-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg apples mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('b9e5125f-2d17-11ee-ace3-1a6083480995', '83eb3a34-2d17-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 1500, 1, NULL, '1 kg beeries mean 1.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 1.5, 'kg'),
('bdab4753-2c81-11ee-ace3-1a6083480995', '967ba5e9-2c81-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg root vegetables mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('d03bad7f-2c80-11ee-ace3-1a6083480995', 'b2359d0a-2c80-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg leeks mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg');

INSERT INTO `sources` (`id`, `co2_producer_id`, `region`, `year`, `user_id`, `name`) VALUES
('083cab84-b0fb-47a0-8e42-001860395395', 'dc70a896-b475-4c0a-b8d2-d0db382cd3c4', NULL, 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('1488d81e-80a9-496e-884b-76da03592ee9', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'USA', 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How much carbon dioxide is produced per kilowatthour of U.S. electricity generation?'),
('24731ab3-aa70-41d8-9a89-bd9215a5a081', '3fcf0a84-a438-440c-bb90-1221907caa8a', 'Global', 2005, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas emissions from ruminant supply chains'),
('48e02428-dbd8-4f88-8df1-63515c28828d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Major cuts of greenhouse gas emissions from livestock within reach'),
('554bc400-2769-4dca-b113-35c09afebd3b', '67ac058e-4156-404e-8933-fa43e950550c', 'UK', 2009, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Quantifying the energy  and carbon effects of  water saving'),
('6fb022bf-2b1c-4bac-90d4-340e64c0ea21', 'ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', NULL, 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', ''),
('a2268f70-d29c-482b-b320-3abf2ab52665', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'Switzerland', 2018, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How climate-friendly is Swiss electricity?'),
('c6efc062-36c3-43ce-8408-30ede05bd8ca', '05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Global', 2014, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Learn the facts: Fuel consumption and CO₂'),
('f2080f15-f195-4661-b0fb-7a5c4bbb7f2d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Tackling Climate Change Through Livestock'),
('fbf38fe8-5591-4ff5-b166-258a2c928a5e', '684b6b08-8b7d-4012-b24b-fafc7464a510', 'UK', 2020, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas reporting: conversion factors 2020');

INSERT INTO `users` (`id`, `email`, `password_hash`, `locked_at`, `failed_login_attempts`) VALUES
('22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'phi.sch', 'XXX', NULL, 0);

CREATE ALGORITHM=UNDEFINED DEFINER=`vt_app`@`localhost` SQL SECURITY DEFINER VIEW `co2_average` AS select `co2`.`id` AS `id`,`co2`.`title` AS `title`,`co2`.`slug` AS `slug`,`co2`.`unit` AS `unit`,cast(((`co2`.`single_consumption_average` * `co2`.`times_per_year_average`) * avg(`sourced_co2_amounts`.`g_co2e`)) as decimal(16,2)) AS `avg_per_year`,avg(`sourced_co2_amounts`.`g_co2e`) AS `avg_per_unit`,`co2`.`single_consumption_from` AS `single_consumption_from`,`co2`.`single_consumption_to` AS `single_consumption_to`,`co2`.`single_consumption_average` AS `single_consumption_average`,`co2`.`times_per_year_from` AS `times_per_year_from`,`co2`.`times_per_year_to` AS `times_per_year_to`,`co2`.`times_per_year_average` AS `times_per_year_average` from (`co2_producers` `co2` join `sourced_co2_amounts` on((`co2`.`id` = `sourced_co2_amounts`.`co2_producer_id`))) group by `sourced_co2_amounts`.`co2_producer_id`;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;