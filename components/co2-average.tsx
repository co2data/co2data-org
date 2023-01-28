import { Co2Average } from '@/domain/repository'

type Props = { co2Average: Co2Average }
const Co2Average = ({ co2Average }: Props) => {
  return (
    <li key={co2Average.title} className="rounded border p-8">
      <p>
        <a href={`/c/${co2Average.slug}`}>{co2Average.title}</a>
      </p>
      <p>
        Possible CO<sub>2</sub>e per person-year
      </p>
      <p>{co2Average.avg_per_year} g</p>
      <p>
        1 {co2Average.unit} {co2Average.avg_per_unit} g CO<sub>2</sub>e
      </p>
    </li>
  )
}

export default Co2Average
