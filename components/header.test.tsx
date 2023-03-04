import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Header from './header'

test('home', () => {
  render(<Header />)
  const navigation = within(screen.getByRole('navigation'))
  expect(navigation.getByRole('link', { name: /contributors/i })).toBeDefined()
  expect(navigation.getByRole('link', { name: /about/i })).toBeDefined()
})
