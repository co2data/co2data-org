import { test, expect } from '@playwright/test'

test('header', async ({ page }) => {
  await page.goto('/')
  const nav = await page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: /about/i })).toBeVisible()
  await expect(nav.getByRole('link', { name: /github/i })).toBeVisible()
  await expect(nav.getByRole('link', { name: /sign up/i })).toBeVisible()
  await expect(nav.getByRole('link', { name: /login/i })).toBeVisible()
})
