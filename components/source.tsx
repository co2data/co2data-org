import { Source } from '@/domain/source'

const Source = ({ source, unit }: { source: Source; unit: string }) => {
  return (
    <li className="max-w-sm list-none overflow-hidden rounded border-4 border-sky-600 bg-sky-100">
      <h3 className="bg-sky-600 px-4 py-2 text-white">
        {source.name}
        {source.region && (
          <>
            &ensp;•&ensp;
            <span className="text-right text-sky-200">{source.region}</span>
          </>
        )}
        {source.year && (
          <>
            &ensp;•&ensp;
            <span className="text-right font-bold">{source.year}</span>
          </>
        )}
      </h3>
      <p className="px-4 pt-2">
        CO<sub>2</sub>e for {source.per} {unit}
      </p>
      <p className="px-4 pb-2 text-right ">
        <span className="text-3xl font-bold">{source.g_co2e / 1000}</span>{' '}
        <span className="">
          kg CO<sub>2</sub>e
        </span>
      </p>
      <p className="px-4 pt-2 text-xs font-bold">Source</p>
      <div
        className="prose prose-sm px-4 pb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0"
        dangerouslySetInnerHTML={{ __html: source.description }}
      ></div>
    </li>
  )
}

export default Source
