import { test, expect } from '@playwright/test'

test('has search', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('Search')).toBeInViewport()
})

test('finds a contributor', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Search').fill('Pork')

  await expect(page.getByRole('main').getByRole('link')).toHaveText('Pork')
})

test('opens a contributor', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('main').getByRole('link', { name: 'Pork' }).click()

  await expect(page).toHaveURL(/pork/i)
  await expect(
    page.getByRole('heading', { level: 1, name: /pork/i })
  ).toBeVisible()
})
