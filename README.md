# Co2data

This is a repository for [co2data.org](https://co2data.org), a website that provides open and transparent data on carbon dioxide (CO2) emissions.

The website aims to inform and empower individuals, organizations, and policymakers to take action on climate change by providing reliable and accessible data on CO2 sources.

The website is built with Next.js and hosted by Vercel. The data is sourced from various public databases such as the Global Carbon Project (GCP), the Carbon Dioxide Information Analysis Center (CDIAC), the Emissions Database for Global Atmospheric Research (EDGAR), and the World Bank.

The website is open source under the MIT license. Contributions are welcome. Please see the contributing guidelines for more details.

## Contribute

### Local development

1. Clone/fork the repo
1. `pnpm install` (pnpm needs to be installed.)
1. `docker compose up -d` (Docker needs to be installed.)
1. Run `infra/db/schema.sql` and `infra/db/seed.sql` in your favorite SQL client
1. Create `.env` from `.env-example`
1. `pnpm dev`

### Pull request

If you want to make a pull request, please check the following list:

- [x] Write a unit and/or e2e test
- [x] Update `infra/db/schema.sql` and `infra/db/seed.sql` if needed
