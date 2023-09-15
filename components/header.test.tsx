import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Header from './header'

test('home', () => {
  render(<Header />)
  const nav = within(screen.getByRole('navigation'))
  expect(nav.getByRole('link', { name: /contributors/i })).toBeInTheDocument()
  expect(nav.getByRole('link', { name: /about/i })).toBeInTheDocument()
})
