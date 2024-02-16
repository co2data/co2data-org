import { makeCo2Average } from '@/domain/co2/example-data'
import { render, screen } from '@testing-library/react'
import { Effect } from 'effect'
import { describe, expect, it, test } from 'vitest'
import { renderImage } from './create-og-image-response'

describe('og image test', () => {
  it('render image', () => {
    const actual = renderImage(makeCo2Average(), '3', [
      <div key="hi">4</div>,
      <div key="ho">500</div>,
    ])

    expect(actual).matchSnapshot('image image')
  })
})
