CREATE TYPE units AS ENUM (
  'kilometer',
  'hour',
  'gram',
  'meter',
  'kilogram',
  'liter',
  'minute'
);

CREATE TABLE authenticators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_id text NOT NULL,
  credential_public_key text NOT NULL,
  counter bigint NOT NULL,
  credential_device_type varchar(32) NOT NULL,
  credential_backed_up smallint NOT NULL,
  user_id UUID NOT NULL,
  transports json DEFAULT NULL
);

CREATE TABLE categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug varchar(255) NOT NULL UNIQUE
);

CREATE TABLE co2_producers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text,
  category_id UUID NOT NULL,
  image varchar(255) DEFAULT NULL,
  user_id UUID NOT NULL,
  unit units NOT NULL,
  single_consumption_from double precision NOT NULL,
  single_consumption_to double precision NOT NULL,
  single_consumption_average double precision NOT NULL,
  times_per_year_from double precision NOT NULL,
  times_per_year_to double precision NOT NULL,
  times_per_year_average double precision NOT NULL,
  slug varchar(255) NOT NULL UNIQUE
);

CREATE TABLE links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sources_id UUID NOT NULL,
  name varchar(191) NOT NULL,
  media_type varchar(191) NOT NULL,
  url varchar(2000) NOT NULL
);

CREATE TABLE sourced_co2_amounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  co2_producer_id UUID NOT NULL,
  source_id UUID NOT NULL,
  g_co2e double precision NOT NULL,
  per double precision NOT NULL,
  quote text,
  description text NOT NULL,
  user_id UUID NOT NULL,
  source_co2e_amount double precision DEFAULT NULL,
  source_co2e_unit varchar(255) DEFAULT NULL
);

CREATE TABLE sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  co2_producer_id UUID NOT NULL,
  region varchar(255) DEFAULT NULL,
  year int DEFAULT NULL,
  user_id UUID NOT NULL,
  name varchar(255) NOT NULL
);

CREATE TABLE users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username varchar(255) NOT NULL,
  current_challenge varchar(255) DEFAULT NULL
);

CREATE VIEW co2_average AS
SELECT
  co2.id AS id,
  co2.title AS title,
  co2.description AS description,
  co2.slug AS slug,
  co2.unit AS unit,
  cast(
    (
      (
        co2.single_consumption_average * co2.times_per_year_average
      ) * avg(sourced_co2_amounts.g_co2e)
    ) AS decimal (16, 2)
  ) AS avg_per_year,
  avg(sourced_co2_amounts.g_co2e) AS avg_per_unit,
  co2.single_consumption_from AS single_consumption_from,
  co2.single_consumption_to AS single_consumption_to,
  co2.single_consumption_average AS single_consumption_average,
  co2.times_per_year_from AS times_per_year_from,
  co2.times_per_year_to AS times_per_year_to,
  co2.times_per_year_average AS times_per_year_average
FROM
  (
    co2_producers co2
    JOIN sourced_co2_amounts ON ((co2.id = sourced_co2_amounts.co2_producer_id))
  )
GROUP BY
  sourced_co2_amounts.co2_producer_id,
  co2.id,
  co2.title,
  co2.description,
  co2.slug,
  co2.unit,
  co2.single_consumption_to,
  co2.single_consumption_from,
  co2.single_consumption_average,
  co2.times_per_year_from,
  co2.times_per_year_to,
  co2.times_per_year_average;

CREATE INDEX sources_co2_producer_id_index ON sources (co2_producer_id);

CREATE INDEX sources_user_id_index ON sources (user_id);

CREATE INDEX sourced_co2_amounts_source_id_co2_producer_id_idx ON sourced_co2_amounts (source_id, co2_producer_id);

CREATE INDEX links_sources_id_idx ON links (sources_id);

CREATE INDEX category_id ON co2_producers (category_id);

CREATE INDEX index_authenticators_on_user_id on authenticators (user_id);