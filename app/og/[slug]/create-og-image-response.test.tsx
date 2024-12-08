import { makeCo2Average } from '@/domain/co2/example-data'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderImage } from './create-og-image-response'

describe('og image test', () => {
  it('render image', () => {
    const { container } = render(
      renderImage(makeCo2Average(), '3', [
        <div key="hi">4</div>,
        <div key="ho">500</div>,
      ]),
    )

    expect(container).matchSnapshot('image image')
  })
})
