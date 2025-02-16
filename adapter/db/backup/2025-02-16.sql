-- -------------------------------------------------------------
-- TablePlus 6.2.1(578)
--
-- https://tableplus.com/
--
-- Database: verceldb
-- Generation Time: 2025-02-16 17:18:15.0920
-- -------------------------------------------------------------


INSERT INTO "authenticators" ("id", "credential_id", "credential_public_key", "counter", "credential_device_type", "credential_backed_up", "user_id", "transports") VALUES
('0e65b4e7-8026-40f8-b0e8-893524f13151', 'M-DJyMYtMcPOso4Ub3Ed3w', 'pQECAyYgASFYIBeG4cwFvyYkGSzLfHCV4ngdd3_AFbCcXNThpjdUbMuwIlgga3WnHnSo9agSK-fnw-LvZ1RVTF56ilT_BMDNg-s0RDw', 0, 'multiDevice', 't', '8e7fdaa9-2226-4871-a98b-c1c693477063', NULL),
('8494c1ad-4bc7-4ca5-8e0c-36ae3e7826e0', 'SXHhLXA-2aEFgytfFcWoWg', 'pQECAyYgASFYIGAOPFm8oiyhrtM-K3uga-FkZj54H2Rw-dfw5RqQiTviIlggW-WHkrsxOUPA6lJt9QUioVwTYsWq6Ge4Kn1BTU318S4', 0, 'multiDevice', 't', '6c4929e3-00fa-4b65-a0dd-95489f44ea62', NULL),
('998ef3cc-cda1-11ee-8206-8ed672e02e23', 'itA4IayM_3rtzXrA8Ozk2Q', 'pQECAyYgASFYIBHuWtfya4Otc8BkUZzMkf4ohJd9jcuEJU92IZVKFTJOIlggwUdGWufQDcBH7fjKp9pqpMto1CjWFscmtp06Z3_Xljw', 0, 'multiDevice', 't', '8ebfe8f5-cda1-11ee-8206-8ed672e02e23', NULL),
('a813657a-e0ac-48d1-a444-5b949ccd9af5', 'PsjCldcO1rBobzhHbHpNzA', 'pQECAyYgASFYIHK2rHrYeftMbiGzlXi5cdMjG7Hu8iXYh1OaQRQfqkFJIlggLe5HlKjS8HyNJmiSWCQ0OnTSkzDCFZDWxKQkvM0S1nc', 0, 'multiDevice', 't', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL),
('b74363fd-3c42-4443-802a-eb896e34c20b', 'YdVQDWAnoajIWlt7NeOKkQ', 'pQECAyYgASFYIKvEdxtL7mpWKysPLMth1lAdAF-p8AQAN9Nz9Hvxi8yvIlggBpSaoBoMPFY-gQQ-9oqgoPFVZx-Rp1Jl0jicHvvsrRM', 0, 'multiDevice', 't', '724ebc26-551b-4f40-a9ba-c595b1de0fcf', NULL),
('ffc63552-8bf1-459f-bab6-dbbefadb9ea7', 'wqq3_eB3CJmsRcSpcCX8sg', 'pQECAyYgASFYICwA5o989WRZuATNqTEnDHb-4Ywsnv8MqmOPWUDEZD6UIlggBfwoCx-xVeusjI42AijWjAd0EyiG2GS6V9AvOu_Hw1g', 0, 'multiDevice', 't', 'a5339998-2282-40d9-bb7c-bc613c0e7cba', NULL);

INSERT INTO "categories" ("id", "title", "slug") VALUES
('092a5cd4-1f4f-4db4-b79c-918dc7fdca2d', 'Buildings', 'buildings'),
('64ac4651-062b-47db-ae5f-9929dc73950d', 'Agriculture', 'agriculture'),
('b0871cb0-3e77-4b90-812e-006106af8a84', 'Electricity', 'electricity'),
('d20e8aa8-384e-405a-90a2-bf30554bf9bb', 'Transportation', 'transportation'),
('dc1695e9-b616-41f4-9c76-84394fea5700', 'Industry', 'industry');

INSERT INTO "co2_producers" ("id", "title", "description", "category_id", "image", "user_id", "unit", "single_consumption_from", "single_consumption_to", "single_consumption_average", "times_per_year_from", "times_per_year_to", "times_per_year_average", "slug") VALUES
('05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Gasoline', NULL, 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'liter', 0, 100, 40, 0, 100, 30, 'gasoline'),
('1651c48c-2c7e-11ee-ace3-1a6083480995', 'Brassicas', NULL, '64ac4651-062b-47db-ae5f-9929dc73950d', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilogram', 0, 0.6, 0.1, 0, 300, 20, 'brassicas'),
('2200a25b-7d77-11ee-b00d-2a57cc5fd6b3', 'Flying by plane', 'When flying from London to Hong Kong return.', 'd20e8aa8-384e-405a-90a2-bf30554bf9bb', NULL, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'kilometer', 100, 20000, 3000, 0, 25, 4, 'flying'),
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
('c07b1549-36db-11ee-8906-96a456a48cc1', '1 kW Electricity', NULL, 'b0871cb0-3e77-4b90-812e-006106af8a84', '', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'hour', 0, 24, 12, 0, 365, 365, 'electricity'),
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

INSERT INTO "links" ("id", "sources_id", "name", "media_type", "url") VALUES
('1eae2eb0-2c64-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Results', 'application/vnd.ms-excel', 'https://josephpoore.com/Data%20S2.xls'),
('6490ea66-2c5e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Author webpage', 'text/html', 'https://josephpoore.com/'),
('649c5ede-7d8b-11ee-b00d-2a57cc5fd6b3', '9523d4ed-7d8a-11ee-b00d-2a57cc5fd6b3', 'Calculator', 'text/html', 'https://www.atmosfair.de/en/offset/flight/'),
('64a3d182-7d8b-11ee-b00d-2a57cc5fd6b3', '9523d4ed-7d8a-11ee-b00d-2a57cc5fd6b3', 'Documentation of the Method and Data', 'application/pdf', 'https://www.atmosfair.de/wp-content/uploads/flight-emissionscalculator-documentation-calculationmethodology.pdf'),
('c62741e3-2c5e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Science Journals article', 'application/pdf', 'https://josephpoore.com/Poore%20and%20Nemecek%20(2018)%20Reducing%20foods%20environmental%20impacts%20through%20producers%20and%20consumers.pdf#page=2'),
('d9113800-2c63-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 'Full database', 'text/html', 'https://ora.ox.ac.uk/objects/uuid:a63fb28c-98f8-4313-add6-e9eca99320a5');

INSERT INTO "sourced_co2_amounts" ("id", "co2_producer_id", "source_id", "g_co2e", "per", "quote", "description", "user_id", "source_co2e_amount", "source_co2e_unit") VALUES
('05b2f196-2d1a-11ee-ace3-1a6083480995', 'dec50cfb-2d19-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg citrus mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('0b35e5c2-36dc-11ee-8906-96a456a48cc1', 'c07b1549-36db-11ee-8906-96a456a48cc1', 'a2268f70-d29c-482b-b320-3abf2ab52665', 128, 1, NULL, '[bafu.admin.ch](https://www.bafu.admin.ch/bafu/de/home/themen/klima/fragen-antworten.html#:~:text=Die%20Kennzahlen%20f%C3%BCr%20die%20verschiedenen,Strommix%3A%2015.7%20g%20CO2eq%2FkWh)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('0b37ac8d-36dc-11ee-8906-96a456a48cc1', 'c07b1549-36db-11ee-8906-96a456a48cc1', '1488d81e-80a9-496e-884b-76da03592ee9', 388, 1, NULL, '[eia.gov](https://www.eia.gov/tools/faqs/faq.php?id=74&t=11#:~:text=This%20equaled%20about%200.92%20pounds%20of%20CO2%20emissions%20per%20kWh)', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', NULL, NULL),
('167db8e7-7d8b-11ee-b00d-2a57cc5fd6b3', '2200a25b-7d77-11ee-b00d-2a57cc5fd6b3', '9523d4ed-7d8a-11ee-b00d-2a57cc5fd6b3', 264, 1, NULL, 'Flight distance	19,350 km = Climate impact 5,117 kg CO₂', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.2644444, 'kg'),
('2b6ba8c7-7d79-11ee-b00d-2a57cc5fd6b3', '2200a25b-7d77-11ee-b00d-2a57cc5fd6b3', '626f78af-7d77-11ee-b00d-2a57cc5fd6b3', 180, 1, NULL, '9700km flight from London to Hong Kong and back produces 3500 kg CO₂ eq. in economy class', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.18, 'kg'),
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
('52eb55e0-7d7d-11ee-b00d-2a57cc5fd6b3', '05e9b91f-fe9e-4679-86c7-fe60fa13fae4', '626f78af-7d77-11ee-b00d-2a57cc5fd6b3', 3460, 1, NULL, 'A 50-litre tank of pertrol is 173 kg CO₂ eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 3.45, 'kg'),
('54e58dfe-2c80-11ee-ace3-1a6083480995', '339e10e7-2c80-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg onions mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg'),
('5c523dee-2c7e-11ee-ace3-1a6083480995', '1651c48c-2c7e-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg brassicas mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg'),
('79a6cc7c-2d18-11ee-ace3-1a6083480995', '5383ded5-2d18-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 900, 1, NULL, '1 kg bananas mean 0.9 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.9, 'kg'),
('96bd0ace-2d19-11ee-ace3-1a6083480995', '6b09a28e-2d19-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg apples mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('b9e5125f-2d17-11ee-ace3-1a6083480995', '83eb3a34-2d17-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 1500, 1, NULL, '1 kg beeries mean 1.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 1.5, 'kg'),
('bdab4753-2c81-11ee-ace3-1a6083480995', '967ba5e9-2c81-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 400, 1, NULL, '1 kg root vegetables mean 0.4 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.4, 'kg'),
('d03bad7f-2c80-11ee-ace3-1a6083480995', 'b2359d0a-2c80-11ee-ace3-1a6083480995', '083cab84-b0fb-47a0-8e42-001860395395', 500, 1, NULL, '1 kg leeks mean 0.5 kg CO2 eq.', '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 0.5, 'kg');

INSERT INTO "sources" ("id", "co2_producer_id", "region", "year", "user_id", "name") VALUES
('083cab84-b0fb-47a0-8e42-001860395395', 'dc70a896-b475-4c0a-b8d2-d0db382cd3c4', NULL, 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek'),
('1488d81e-80a9-496e-884b-76da03592ee9', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'USA', 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How much carbon dioxide is produced per kilowatthour of U.S. electricity generation?'),
('24731ab3-aa70-41d8-9a89-bd9215a5a081', '3fcf0a84-a438-440c-bb90-1221907caa8a', 'Global', 2005, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas emissions from ruminant supply chains'),
('48e02428-dbd8-4f88-8df1-63515c28828d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Major cuts of greenhouse gas emissions from livestock within reach'),
('554bc400-2769-4dca-b113-35c09afebd3b', '67ac058e-4156-404e-8933-fa43e950550c', 'UK', 2009, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Quantifying the energy  and carbon effects of  water saving'),
('626f78af-7d77-11ee-b00d-2a57cc5fd6b3', '2200a25b-7d77-11ee-b00d-2a57cc5fd6b3', 'UK', 2020, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'HOW BAD ARE BANANAS? The carbon footprint of everything, Mike Berners-Lee'),
('6fb022bf-2b1c-4bac-90d4-340e64c0ea21', 'ae13e603-b2f5-4a4a-a8ba-2799f32a2dc4', NULL, 2019, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', ''),
('9523d4ed-7d8a-11ee-b00d-2a57cc5fd6b3', '2200a25b-7d77-11ee-b00d-2a57cc5fd6b3', 'Global', 2022, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'atmosfair Flight Emissions Calculator'),
('a2268f70-d29c-482b-b320-3abf2ab52665', '4067b5fe-582d-4cc1-948b-3c704aebd5fa', 'Switzerland', 2018, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'How climate-friendly is Swiss electricity?'),
('c6efc062-36c3-43ce-8408-30ede05bd8ca', '05e9b91f-fe9e-4679-86c7-fe60fa13fae4', 'Global', 2014, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Learn the facts: Fuel consumption and CO₂'),
('f2080f15-f195-4661-b0fb-7a5c4bbb7f2d', 'c8d6f416-ad52-484f-9f7e-b510dac2c158', 'Global', 2013, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Tackling Climate Change Through Livestock'),
('fbf38fe8-5591-4ff5-b166-258a2c928a5e', '684b6b08-8b7d-4012-b24b-fafc7464a510', 'UK', 2020, '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'Greenhouse gas reporting: conversion factors 2020');

INSERT INTO "users" ("id", "username", "current_challenge") VALUES
('04176ad1-cbae-4fcc-a70c-b15435f3a4c0', 'tssss', 'RviNZOj-DxNHiyRrGERgLjY64BpB4lhWqaj0q8RNawY'),
('22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c', 'philip', 'Rgpv4_S4eCMF6b1TZHrJQITkKV469fARYjQGJc41A9M'),
('4460617b-bdee-4c51-aa2e-b5b8ef1773cd', 'unknown-1', NULL),
('4dac7b4c-0d77-43e7-abb1-c54a6f4587f1', 'unknown-2', NULL),
('536aac91-8e64-454e-a992-3718c2606f0c', 'unknown-3', NULL),
('57c5a099-a17c-48ac-8ab8-22bc195d1b76', 'Ipad', 'c59srSdKJXvFC6Byc8_VgF8pyY8x_a9ieQvb2pWb0sA'),
('597d8b65-0cad-4173-b215-85e46fb1ffaf', 'unknown-4', NULL),
('6998c159-5401-4bd0-873c-57efba84d2e1', 'Test', 'USa8T0vOxyt8P4KDRSqVMRlAw5c2SvsC4WYy2H7XOU8'),
('6c4929e3-00fa-4b65-a0dd-95489f44ea62', 'TTT', '7Iidq5aOJ7kNGY-xjBNjZtfdYva_H4NsknE9bw8vaK4'),
('8e7fdaa9-2226-4871-a98b-c1c693477063', 'niaafifah', '4F9TGikpNyufeoaqVAm0Xnu-rTcEi4qabq6RjJxzl5o'),
('a23b95c0-ef95-44b5-8f62-851dfc06b242', 'unknown-5', NULL),
('a93813b2-6fee-44f2-9dab-2844b69c4517', 'unknown-6', NULL);

