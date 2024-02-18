import { expect, test } from '@playwright/test'

test('header', async ({ page }) => {
  await page.goto('/')
  const nav = await page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: /about/i })).toBeVisible()
  await expect(nav.getByRole('link', { name: /github/i })).toBeVisible()
  const userButton = nav.getByRole('button', { name: /user/i })
  await expect(userButton).toBeVisible()
  await userButton.click()

  const userMenu = await page.getByRole('menu', { name: /user/i })
  await expect(userMenu.getByRole('menuitem', { name: /login/i })).toBeVisible()
  await expect(
    userMenu.getByRole('menuitem', { name: /sign up/i }),
  ).toBeVisible()
})
