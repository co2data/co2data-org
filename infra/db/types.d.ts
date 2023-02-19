import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, string | number, string | number>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Categories {
  id: Generated<string>;
  title: string;
  slug: Generated<string>;
}

export interface Co2Average {
  id: Generated<string>;
  title: string;
  slug: string;
  unit: "gram" | "hour" | "kilogram" | "kilometer" | "liter" | "meter" | "minute";
  avg_per_year: Decimal | null;
  avg_per_unit: number | null;
  single_consumption_from: number;
  single_consumption_to: number;
  single_consumption_average: number;
  times_per_year_from: number;
  times_per_year_to: number;
  times_per_year_average: number;
}

export interface Co2Producers {
  id: Generated<string>;
  title: string;
  description: string | null;
  category_id: string;
  image: string | null;
  user_id: string;
  unit: "gram" | "hour" | "kilogram" | "kilometer" | "liter" | "meter" | "minute";
  single_consumption_from: number;
  single_consumption_to: number;
  single_consumption_average: number;
  times_per_year_from: number;
  times_per_year_to: number;
  times_per_year_average: number;
  slug: string;
}

export interface Sources {
  id: Generated<string>;
  co2_producer_id: string;
  region: string | null;
  year: number | null;
  g_co2e: number;
  per: number;
  description: string;
  user_id: string;
  name: Generated<string>;
}

export interface Users {
  id: Generated<string>;
  email: string;
  password_hash: string;
  locked_at: Date | null;
  failed_login_attempts: Generated<number>;
}

export interface DB {
  categories: Categories;
  co2_average: Co2Average;
  co2_producers: Co2Producers;
  sources: Sources;
  users: Users;
}
