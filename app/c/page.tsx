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
    <>
      <ul>
        {co2Averages
          .filter((co2) =>
            search
              ? co2.title.toLowerCase().includes(search.toLowerCase())
              : true
          )
          .map((co2Average) => (
            <Co2Average key={co2Average.slug} co2Average={co2Average} />
          ))}
      </ul>
    </>
  )
}
