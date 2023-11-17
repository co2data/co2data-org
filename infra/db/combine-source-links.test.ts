import { describe, expect, it } from 'vitest'
import { combineLinks } from './combine-source-links'

const testData = [
  {
    id: '2b914117-d5e2-11ed-9416-de741d4b6ce8',
    gCo2e: 18400,
    per: 1,
    quote: null,
    description:
      'the carbon intensity of beef from the specialized beef herds is almost nfourfold that produced from the dairy herd (67.8 vs. 18.4 kg CO2-eq per kg carcass weight). nn[fao.org](https://www.fao.org/3/i3461e/i3461e03.pdf)',
    userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
    name: 'Greenhouse gas emissions from ruminant supply chains',
    year: 2005,
    region: 'Global',
    sourcesId: '24731ab3-aa70-41d8-9a89-bd9215a5a081',
    links: null,
  },
  {
    id: '2bb06589-d5e2-11ed-9416-de741d4b6ce8',
    gCo2e: 170000,
    per: 1,
    quote: null,
    description: '100g protein from beef (dairy herd) mean 17 kg CO2 eq.',
    userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
    name: 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek',
    year: 2019,
    region: null,
    sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
    links: {
      id: 'd9113800-2c63-11ee-ace3-1a6083480995',
      sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
      name: 'Full database',
      mediaType: 'text/html',
      url: 'https://ora.ox.ac.uk/objects/uuid:a63fb28c-98f8-4313-add6-e9eca99320a5',
    },
  },
  {
    id: '2bb06589-d5e2-11ed-9416-de741d4b6ce8',
    gCo2e: 170000,
    per: 1,
    quote: null,
    description: '100g protein from beef (dairy herd) mean 17 kg CO2 eq.',
    userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
    name: 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek',
    year: 2019,
    region: null,
    sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
    links: {
      id: 'c62741e3-2c5e-11ee-ace3-1a6083480995',
      sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
      name: 'Science Journals article',
      mediaType: 'application/pdf',
      url: 'https://josephpoore.com/Poore%20and%20Nemecek%20(2018)%20Reducing%20foods%20environmental%20impacts%20through%20producers%20and%20consumers.pdf#page=2',
    },
  },
  {
    id: '2bb06589-d5e2-11ed-9416-de741d4b6ce8',
    gCo2e: 170000,
    per: 1,
    quote: null,
    description: '100g protein from beef (dairy herd) mean 17 kg CO2 eq.',
    userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
    name: 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek',
    year: 2019,
    region: null,
    sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
    links: {
      id: '6490ea66-2c5e-11ee-ace3-1a6083480995',
      sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
      name: 'Author webpage',
      mediaType: 'text/html',
      url: 'https://josephpoore.com/',
    },
  },
  {
    id: '2bb06589-d5e2-11ed-9416-de741d4b6ce8',
    gCo2e: 170000,
    per: 1,
    quote: null,
    description: '100g protein from beef (dairy herd) mean 17 kg CO2 eq.',
    userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
    name: 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek',
    year: 2019,
    region: null,
    sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
    links: {
      id: '1eae2eb0-2c64-11ee-ace3-1a6083480995',
      sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
      name: 'Results',
      mediaType: 'application/vnd.ms-excel',
      url: 'https://josephpoore.com/Data%20S2.xls',
    },
  },
]

describe('combine source links', () => {
  it('happy path', () => {
    const actual = combineLinks(testData)
    const expected = [
      {
        description:
          'the carbon intensity of beef from the specialized beef herds is almost nfourfold that produced from the dairy herd (67.8 vs. 18.4 kg CO2-eq per kg carcass weight). nn[fao.org](https://www.fao.org/3/i3461e/i3461e03.pdf)',
        gCo2e: 18400,
        id: '2b914117-d5e2-11ed-9416-de741d4b6ce8',
        links: {},
        name: 'Greenhouse gas emissions from ruminant supply chains',
        per: 1,
        quote: null,
        region: 'Global',
        sourcesId: '24731ab3-aa70-41d8-9a89-bd9215a5a081',
        userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
        year: 2005,
      },
      {
        description: '100g protein from beef (dairy herd) mean 17 kg CO2 eq.',
        gCo2e: 170000,
        id: '2bb06589-d5e2-11ed-9416-de741d4b6ce8',
        links: {
          value: [
            {
              id: 'd9113800-2c63-11ee-ace3-1a6083480995',
              mediaType: 'text/html',
              name: 'Full database',
              sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
              url: 'https://ora.ox.ac.uk/objects/uuid:a63fb28c-98f8-4313-add6-e9eca99320a5',
            },
            {
              id: 'c62741e3-2c5e-11ee-ace3-1a6083480995',
              mediaType: 'application/pdf',
              name: 'Science Journals article',
              sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
              url: 'https://josephpoore.com/Poore%20and%20Nemecek%20(2018)%20Reducing%20foods%20environmental%20impacts%20through%20producers%20and%20consumers.pdf#page=2',
            },
            {
              id: '6490ea66-2c5e-11ee-ace3-1a6083480995',
              mediaType: 'text/html',
              name: 'Author webpage',
              sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
              url: 'https://josephpoore.com/',
            },
            {
              id: '1eae2eb0-2c64-11ee-ace3-1a6083480995',
              mediaType: 'application/vnd.ms-excel',
              name: 'Results',
              sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
              url: 'https://josephpoore.com/Data%20S2.xls',
            },
          ],
        },
        name: 'Reducing food’s environmental impacts through producers and  consumers, J. Poore, T. Nemecek',
        per: 1,
        quote: null,
        region: null,
        sourcesId: '083cab84-b0fb-47a0-8e42-001860395395',
        userId: '22ecf9d3-27a8-4cbf-8b66-54d96fa6bd2c',
        year: 2019,
      },
    ]
    expect(actual).toStrictEqual(expected)
  })
})
