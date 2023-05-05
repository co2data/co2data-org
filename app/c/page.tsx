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
      <>
        <div className="absolute inset-0 z-10 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-sky-600 opacity-40"></div>
        </div>
        <div className="relative m-auto max-w-sm">
          <div className="absolute inset-0 -top-20 z-10 ">
            <ul className="relative space-y-4 rounded-xl border border-blue-300 bg-blue-50 bg-opacity-20 px-16 pt-24 pb-8 backdrop-blur">
              {co2Averages
                .filter(
                  (co2) =>
                    search &&
                    co2.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((co2Average) => (
                  <Co2Average key={co2Average.slug} co2Average={co2Average} />
                ))}
            </ul>
          </div>
        </div>
      </>
    )
  )
}
