import { Co2Average } from '@/domain/repository'
import Link from 'next/link'

type Props = { co2Average: Co2Average }
const Co2Average = ({ co2Average }: Props) => {
  return (
    <li
      key={co2Average.slug}
      className="rounded border-4 border-sky-600 bg-sky-100"
    >
      <p className="bg-sky-600 px-4 py-2 font-bold text-white">
        <Link href={`/c/${co2Average.slug}`}>{co2Average.title}</Link>
      </p>
      <p className="px-4 py-2 text-xs ">
        Possible CO<sub>2</sub>e per person-year
      </p>
      <p className="px-4 text-right text-3xl font-bold">
        {+parseFloat(((co2Average.avg_per_year ?? 1) / 1000).toFixed(3))}{' '}
        <span className="text-sm font-normal">kg</span>
      </p>
      <div className="flex justify-between gap-2">
        <p className="py-2 pl-4 text-xs">1 {co2Average.unit}</p>
        <p className="py-2 pr-4 text-xs">
          {(co2Average.avg_per_unit ?? 1) / 1000} kg CO<sub>2</sub>e
        </p>
      </div>
    </li>
  )
}

export default Co2Average
