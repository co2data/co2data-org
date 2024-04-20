import type { Co2Average } from '@/domain/co2'
import { format } from '@/lib/utils'
import convert from 'convert'
import Link from 'next/link'
import { Fragment } from 'react'

const formatter = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: 'kilogram',
  notation: 'standard',
  minimumFractionDigits: 3,
})

type Props = { co2Average: Co2Average }
const Co2AverageComponent = ({ co2Average }: Props) => {
  return (
    <li
      key={co2Average.slug}
      className="rounded border-4 border-border bg-card"
    >
      <p className="bg-border px-4 py-2 font-bold text-white">
        <Link href={`/c/${co2Average.slug}`}>{co2Average.title}</Link>
      </p>
      <p className="px-4 py-2 text-xs">
        Possible CO<sub>2</sub>e per person-year
      </p>
      <p className="px-4 text-right">
        {formatAvgPerYear(co2Average.avgPerYear)}{' '}
        <span className="text-sm">kg</span>
      </p>
      <div className="flex justify-between gap-2">
        <p className="py-2 pl-4 text-xs">1 {co2Average.unit}</p>
        <p className="py-2 pr-4 text-xs">
          {format(convert(co2Average.avgPerUnit, 'grams').to('kg'), {
            trialingZeros: false,
          })}{' '}
          kg CO
          <sub>2</sub>e
        </p>
      </div>
    </li>
  )
}

export default Co2AverageComponent
function formatAvgPerYear(avgPerYear: number) {
  const formattedParts = formatter.formatToParts(
    convert(avgPerYear, 'grams').to('kg'),
  )

  return formattedParts.map(({ type, value }) => {
    switch (type) {
      case 'unit':
      case 'literal':
        return <Fragment key={type + value} />
      case 'integer':
        return (
          <span key={type + value} className="font-extrabold text-4xl">
            {value}
          </span>
        )
      default:
        return (
          <span key={type + value} className="font-extrabold text-sm">
            {value}
          </span>
        )
    }
  })
}
