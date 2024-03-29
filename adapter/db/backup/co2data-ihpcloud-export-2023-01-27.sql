-- -------------------------------------------------------------
-- TablePlus 4.8.7(448)
--
-- https://tableplus.com/
--
-- Database: a4c587de-489f-4784-b2ae-fff3cc3eb95b
-- Generation Time: 2023-01-27 10:17:28.8230
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE categories (
    id char(36) DEFAULT (uuid()) NOT NULL,
    title text NOT NULL,
    slug varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.


-- Table Definition
CREATE TABLE co2_producers (
    id char(36) DEFAULT (uuid()) NOT NULL,
    title varchar(255) NOT NULL,
    description text,
    category_id char(36) NOT NULL,
    image varchar(255),
    user_id char(36) NOT NULL,
    unit ENUM('kilometer', 'hour', 'gram', 'meter', 'kilogram', 'liter', 'minute') NOT NULL,
    single_consumption_from float8 NOT NULL,
    single_consumption_to float8 NOT NULL,
    single_consumption_average float8 NOT NULL,
    times_per_year_from float8 NOT NULL,
    times_per_year_to float8 NOT NULL,
    times_per_year_average float8 NOT NULL,
    slug varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE sources (
    id char(36) DEFAULT (uuid()) NOT NULL,
    co2_producer_id char(36) NOT NULL,
    region varchar(255),
    year int4,
    g_co2e float8 NOT NULL,
    per float8 NOT NULL,
    description text NOT NULL,
    user_id char(36) NOT NULL,
    name varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE users (
    id char(36) DEFAULT (uuid()) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    locked_at TIMESTAMP,
    failed_login_attempts int4 NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO categories (id, title, slug) VALUES
('092a5cd4-1f4f-4db4-b79c-918dc7fdca2d', 'Buildings', 'buildings'),
('64ac4651-062b-47db-ae5f-9929dc73950d', 'Agriculture', 'agriculture'),
('b0871cb0-3e77-4b90-812e-006106af8a84', 'Electricity', 'electricity'),
('d20e8aa8-384e-405a-90a2-bf30554bf9bb', 'Transportation', 'transportation'),
('dc1695e9-b616-41f4-9c76-84394fea5700', 'Industry', 'industry');

INSERT INTO co2_producers (id, title, description, category_id, image, user_id, unit, single_consumption_from, single_consumption_to, single_consumption_average, times_per_year_from, times_per_year_to, times_per_year_average, slug) VALUES
('05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Gasoline', NULL, 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 100, 40, 0, 100, 62, 'gasoline'),
('258aaa11-a891-4f9a-b29b-67086edd53e6', 'Pork', 'Pig meat', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 300, 100, 'pork'),
('2a3fd46e-f20d-4961-a89e-11b9236448e4', 'Poultry Meat', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilometer', 0, 1, 0.1, 0, 300, 50, 'poultry-meat'),
('34669972-a53e-4bee-a2cc-2c8414014a39', 'Tofu', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.1, 0, 100, 1, 'tofu'),
('3570f84b-fcc7-45c5-b415-ec19a56c77ea', 'Nuts', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 100, 20, 'nuts'),
('3fcf0a84-a438-440c-bb90-1221907caa8a', 'Beef (dairy herd)', 'Beef from dairy herd.', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 360, 120, 'beef-dairy-herd'),
('4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'LED Lightbulb (7W)', NULL, 'b0871cb0-3e77-4b90-812e-006106af8a84', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'hour', 0, 24, 8, 0, 365, 200, 'led-lightbulb-7w'),
('67ac058e-4156-404e-8933-fa43e950550c', 'Shower', NULL, '092a5cd4-1f4f-4db4-b79c-918dc7fdca2d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'minute', 0, 15, 6, 0, 600, 210, 'shower'),
('684b6b08-8b7d-4012-b24b-fafc7464a510', 'Ferry', NULL, 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilometer', 0, 1000, 10, 0, 100, 2, 'ferry'),
('7e7363d7-458a-45c9-8158-845628aab7eb', 'Cheese', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.2, 0.02, 0, 300, 20, 'cheese'),
('8ade21c7-64e5-4c36-9308-7414c826f73f', 'Soymilk', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 1, 0.2, 0, 300, 6, 'soymilk'),
('95a12fea-124f-4c05-a0a2-ba5faa4adb9a', 'Olive Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 300, 45, 'olive-oil'),
('ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', 'Lamb Meat', 'Lamb meat', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 100, 20, 'lamb-meat'),
('ba7ba10c-fd19-48e7-a606-8941f34775df', 'Milk', 'Dairy milk', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 1, 0.2, 0, 600, 200, 'milk'),
('c72452c9-d4cb-4a9b-8a99-113ee7c24dc5', 'Soybean Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 1000, 600, 'soybean-oil'),
('c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Beef (beef herd)', 'Beef from the specialized beef herds.', '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 360, 120, 'beef-beef-herd'),
('d8bcad6a-77a3-4ce6-8d4f-aee796e35117', 'Peanuts', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 100, 20, 'peanuts'),
('d9e9f7c1-ba53-4477-8a8f-74ea39c4d631', 'Fish (farmed)', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 1, 0.1, 0, 300, 50, 'fish-farmed'),
('dc70a896-b475-4c0a-b8d2-d0db382cd3c4', 'Eggs', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 300, 50, 'eggs'),
('eb71fed0-ca8b-4dfd-a201-0ae62150bc61', 'Peas', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.1, 0, 100, 10, 'peas'),
('f71d3153-3746-44f1-bc0b-0a7d92565efe', 'Grains', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.5, 0.05, 0, 1000, 500, 'grains'),
('f8f07a6e-f98e-43ee-b56e-49b551441179', 'Palm Oil', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 0.4, 0.01, 0, 1600, 800, 'palm-oil');


INSERT INTO sources (id, co2_producer_id, region, year, g_co2e, per, description, user_id, name) VALUES
('083cab84-b0fb-47a0-8e42-001860395395', 'dc70a896-b475-4c0a-b8d2-d0db382cd3c4', NULL, 2019, 42000, 1, '100g protein from eggs mean 4.2 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('1488d81e-80a9-496e-884b-76da03592ee9', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'USA', 2019, 3, 1, '<https://www.eia.gov/tools/faqs/faq.php?id=74&t=11#:~:text=This%20equaled%20about%200.92%20pounds%20of%20CO2%20emissions%20per%20kWh>', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How much carbon dioxide is produced per kilowatthour of U.S. electricity generation?'),
('1f7e6a1f-7c88-4b17-b542-d92d2e542e48', '95a12fea-124f-4c05-a0a2-ba5faa4adb9a', NULL, 2019, 5400, 1, '1 liter from olive oil mean 5.4 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('24731ab3-aa70-41d8-9a89-bd9215a5a081', '3fcf0a84-a438-440c-bb90-1221907caa8a', 'Global', 2005, 18400, 1, 'the carbon intensity of beef from the specialized beef herds is almost 
fourfold that produced from the dairy herd (67.8 vs. 18.4 kg CO2-eq per kg carcass weight). 

[fao.org](https://www.fao.org/3/i3461e/i3461e03.pdf)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas emissions from ruminant supply chains'),
('2890e38a-7d6f-47ba-8a44-3f0576c2cce8', 'c72452c9-d4cb-4a9b-8a99-113ee7c24dc5', NULL, 2019, 6300, 1, '1 liter from soybean oil mean 6.3 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('2cbfccbc-aec1-4cf4-89d2-7a169fc507a8', 'f71d3153-3746-44f1-bc0b-0a7d92565efe', NULL, 2019, 27000, 1, '100g protein from grains mean 2.7 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('354342a1-adea-449f-8b1e-7e37413317ea', 'ba7ba10c-fd19-48e7-a606-8941f34775df', NULL, 2019, 3200, 1, '1liter milk mean 3.2 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('38f80b84-84f0-481f-81c9-ae416af6ef7a', '7e7363d7-458a-45c9-8158-845628aab7eb', NULL, 2019, 110000, 1, '100g protein from cheese mean 11 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek3'),
('48e02428-dbd8-4f88-8df1-63515c28828d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, 300000, 1, 'Emission intensities (i.e. emissions per unit of product) vary from commodity to commodity. They are highest for beef (almost 300 kg CO2-eq per kilogram of protein produced), followed by meat and milk from small ruminants (165 and 112kg CO2-eq.kg respectively)

[fao.org](https://www.fao.org/news/story/en/item/197623/icode/)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Major cuts of greenhouse gas emissions from livestock within reach'),
('4bcd924c-4d94-4498-aab0-2f17230ea32e', '258aaa11-a891-4f9a-b29b-67086edd53e6', NULL, 2019, 76000, 1, '100g protein from pig meat mean 7.6 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('554bc400-2769-4dca-b113-35c09afebd3b', '67ac058e-4156-404e-8933-fa43e950550c', 'UK', 2009, 115.4, 1, '[PDF](https://www.waterwise.org.uk/wp-content/uploads/2018/02/Energy-Saving-Trust-2009_Quantifying-the-Energy-and-Carbon-Effects-of-Water-Saving_Full-Technical-Report.pdf)

Standard assumptions 
- Occupancy 2.4 person 
- Building floor area 84 m2
- System boiler with 12m primary pipe work and 120 litre cylinder with 25mm foam insulation.  
- Hot water storage temperature 55°C3
- Cold water feed 13°C 
- Mains water embodied carbon 0.75 kg CO2e/m3
- 28m of 15mm hot water pipe work
- Shower 7 litres/min 
- 0.59 showers per person per day
- 25.7l per shower
- Annually 89kg CO₂ per household

89kg CO2 ÷ (25.7l × 0.59sw/p/d × 365d ÷ 7l/min) = 0.1154 kg CO2 per min

', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Quantifying the energy  and carbon effects of  water saving'),
('6da879ec-4daa-44e7-8db6-28e570636c8f', 'eb71fed0-ca8b-4dfd-a201-0ae62150bc61', NULL, NULL, 4000, 1, '100g protein from peas mean 0.4 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('6fb022bf-2b1c-4bac-90d4-340e64c0ea21', 'ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', NULL, 2019, 200000, 1, '100g protein lamb & mutton mean 20 kg CO2 eq.  

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', ''),
('71fc3493-3269-49a9-b773-84976d4d1c5b', '8ade21c7-64e5-4c36-9308-7414c826f73f', NULL, 2019, 1000, 1, '1 liter soymilk mean 1.0 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('7ba3b2bd-a209-486b-ab4e-869612153f0c', 'd8bcad6a-77a3-4ce6-8d4f-aee796e35117', NULL, 2019, 12000, 1, '100g protein from peanuts mean 1.2 kg CO2 eq. 

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid%3ab0b53649-5e93-4415-bf07-6b0b1227172f) [PDF](https://ora.ox.ac.uk/objects/uuid%3ab0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2b360%2b6392%2b987%2b-%2bAccepted%2bManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and consumers'),
('9a12a2bf-4a47-4a36-96d8-14ba8330db6c', 'd9e9f7c1-ba53-4477-8a8f-74ea39c4d631', NULL, 2019, 60000, 1, '100g protein from fish (farmed) mean 6 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('a2268f70-d29c-482b-b320-3abf2ab52665', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'Switzerland', 2018, 1, 1, '<https://www.bafu.admin.ch/bafu/de/home/themen/klima/fragen-antworten.html#:~:text=Die%20Kennzahlen%20f%C3%BCr%20die%20verschiedenen,Strommix%3A%2015.7%20g%20CO2eq%2FkWh>', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How climate-friendly is Swiss electricity?'),
('a925b2ae-a7e3-4c94-974c-37eed66e9f20', 'f8f07a6e-f98e-43ee-b56e-49b551441179', NULL, 2019, 7300, 1, '1 liter from palm oil mean 7.3 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('c6efc062-36c3-43ce-8408-30ede05bd8ca', '05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Global', 2014, 2312, 1, '<https://www.nrcan.gc.ca/sites/www.nrcan.gc.ca/files/oee/pdf/transportation/fuel-efficient-technologies/autosmart_factsheet_6_e.pdf>', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Learn the facts: Fuel consumption and CO₂'),
('cab21f63-8873-44d4-9621-ab5436c7da8c', '3570f84b-fcc7-45c5-b415-ec19a56c77ea', NULL, 2019, 3000, 1, '100g protein from nuts mean 0.3 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('d03c94bc-b6b1-43df-9c53-80ef1ff7a001', '3fcf0a84-a438-440c-bb90-1221907caa8a', NULL, 2019, 170000, 1, '100g protein from beef (dairy herd) mean 17 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid%3ab0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2b360%2b6392%2b987%2b-%2bAccepted%2bManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('d1a953aa-1299-43bc-9ffa-4f96e2c82719', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2019, 500000, 1, '100g protein from beef (beef herd) mean 50 kg CO2 eq.  

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and consumers, J. Poore, T. Nemecek'),
('eb9c2db0-1eb2-4fbf-a20b-fe7ffa2e5872', '34669972-a53e-4bee-a2cc-2c8414014a39', NULL, 2019, 20000, 1, '100g protein from tofu mean 2.0 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid%3ab0b53649-5e93-4415-bf07-6b0b1227172f) [PDF](https://ora.ox.ac.uk/objects/uuid%3ab0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2b360%2b6392%2b987%2b-%2bAccepted%2bManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and consumers'),
('ed43ec62-72e9-42d4-8522-4682e4651513', '2a3fd46e-f20d-4961-a89e-11b9236448e4', NULL, 2019, 57000, 1, '100g protein from poultry meat mean 5.7 kg CO2 eq.

[ora.ox.ac.uk](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f)
[PDF](https://ora.ox.ac.uk/objects/uuid:b0b53649-5e93-4415-bf07-6b0b1227172f/download_file?file_format=pdf&safe_filename=Reducing_foods_environment_impacts_Science%2B360%2B6392%2B987%2B-%2BAccepted%2BManuscript.pdf&type_of_work=Journal+article#page=6)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('f2080f15-f195-4661-b0fb-7a5c4bbb7f2d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, 67600, 1, '67,6kg CO2-eq/kg product of beef (carcass weight and does not include post-harvest emissions.) 

[fao.org (PDF)](https://www.fao.org/3/i3437e/i3437e.pdf) Page 24', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Tackling Climate Change Through Livestock'),
('fbf38fe8-5591-4ff5-b166-258a2c928a5e', '684b6b08-8b7d-4012-b24b-fafc7464a510', 'UK', 2020, 112.86, 1, '[Excel](<https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020#:~:text=Conversion%20factors%202020:%20condensed%20set%20(for%20most%20users)>) Sheet Business travel- sea', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas reporting: conversion factors 2020');

INSERT INTO users (id, email, password_hash, locked_at, failed_login_attempts) VALUES
('22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'phi.sch@hotmail.ch', 'sha256|17|DVPYf4lLTwOEsFVGOLVn8Q==|YcfndxwJ1BJiaUSKobGghhoa+F3PXQ1kEJCfw8MDBOU=', NULL, 0),
('4460617b-bdee-4c51-aa2e-b5b8ef1773cd', 'pwangdu9462@gmail.com', 'sha256|17|6rvLvyQnhu1UgigZWWkqqg==|e5WypNyaqYO/qB7/mCmybVsgxYNfnyh5Ppex2e5jA2M=', NULL, 0),
('4dac7b4c-0d77-43e7-abb1-c54a6f4587f1', 'debaroti.geo1@gmail.com', 'sha256|17|oozAYIuwVD86C6eVzap2lA==|KIbixBOgTXsC3cmCifmRLvRe88fSIF9izMf8kAN9GCA=', NULL, 0),
('536aac91-8e64-454e-a992-3718c2606f0c', 'ilia@notifyparty.ru', 'sha256|17|Dmgy6dn6MiShsai02ss3ZQ==|CEVDTucoS+Gn2BWzhJvLWq/YTzyr9KRxGMYHxdIB0d0=', NULL, 0),
('597d8b65-0cad-4173-b215-85e46fb1ffaf', 'factoryamar@gmail.com', 'sha256|17|8/sLjK2ylJOdGnYhRi+ZzA==|cFLCMUzSvjwpbvTLWUa6rEtLmaE7KoyyMZnrJQsQUag=', NULL, 0),
('a23b95c0-ef95-44b5-8f62-851dfc06b242', 'dhanunor1982@mail.ru', 'sha256|17|m0Gbx5IyJCLB6+lOULmC/Q==|gW1rLyH+TsZHg0mY/VANqn/v+zIV1CD4Xvu4DuZ5Yp0=', NULL, 0),
('a93813b2-6fee-44f2-9dab-2844b69c4517', 'likax9yev@mail.ru', 'sha256|17|SnZqFv8+BCQum+1YnvXfpg==|SBa3WRnD4K1Fg9rvH5/KdbLYCem1EYY9Ng4BUbWgLfg=', NULL, 0),
('d6bd2c38-3e77-47df-855a-028885b941e6', 'teste@com.br', 'sha256|17|pmCngEq8h6mcQm6g8SAw0A==|MJ19wCv0bMSXS+8fZDh1R3ZIDU14ysq8MHxS01guEuA=', NULL, 0);

ALTER TABLE co2_producers ADD FOREIGN KEY (category_id) REFERENCES categories(id);
