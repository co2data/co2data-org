import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/co2data.org/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/co2 data/i)
})

test('checks sitemap.xml', async ({ page }) => {
  await page.goto('/sitemap.xml')
  const content = await page.content()
  const urlToCheck = 'https://co2data.org/c/pork'

  expect(content).toContain(urlToCheck)
})

test('checks robots.txt', async ({ page }) => {
  await page.goto('/robots.txt')
  const actual = await page.content()

  expect(actual).toContain('User-agent: *')
  expect(actual).toContain('Allow: ')
  expect(actual).toContain(`Sitemap: ${process.env.BASE_URL}/sitemap.xml`)
})

test('head has canonical on root', async ({ page }) => {
  await page.goto('/')
  const metaDescription = page.locator('link[rel="canonical"]')
  await expect(metaDescription).toHaveAttribute('href', 'https://co2data.org')
})

test('head has canonical on pork', async ({ page }) => {
  await page.goto('/c/pork')
  const metaDescription = page.locator('link[rel="canonical"]')
  await expect(metaDescription).toHaveAttribute(
    'href',
    'https://co2data.org/c/pork',
  )
})

test('head has description', async ({ page }) => {
  await page.goto('/')
  const metaDescription = page.locator('meta[name="description"]')
  await expect(metaDescription).toHaveAttribute(
    'content',
    'What are the CO₂ emissions of things.',
  )
})
