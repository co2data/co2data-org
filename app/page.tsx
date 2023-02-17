import Co2Average from '@/components/co2-average'
import { getAllCo2Averages } from '@/domain/repository'

export default async function Home() {
  const co2Averages = await getAllCo2Averages()

  return (
    <main>
      <ul className="flex flex-wrap gap-8">
        {co2Averages.map((co2Average) => (
          <Co2Average key={co2Average.slug} co2Average={co2Average} />
        ))}
      </ul>
    </main>
  )
}
