import Co2Average from '@/components/co2-average'
import { repository } from '@/domain/co2'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { getAllCo2Averages } = repository()

  const co2Averages = await getAllCo2Averages()

  const search = searchParams.search as string

  return (
    search && (
      <div className="absolute inset-0 z-10 ">
        <ul className="relative m-4 space-y-4 rounded-md border border-blue-300 p-4 backdrop-blur before:absolute before:inset-0 before:-z-10 before:bg-white before:opacity-50">
          {co2Averages
            .filter((co2) =>
              search
                ? co2.title.toLowerCase().includes(search.toLowerCase())
                : false
            )
            .map((co2Average) => (
              <Co2Average key={co2Average.slug} co2Average={co2Average} />
            ))}
        </ul>
      </div>
    )
  )
}
