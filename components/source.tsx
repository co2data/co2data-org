import { Source } from '@/domain/source'
import convert from 'convert'

const Source = ({ source, unit }: { source: Source; unit: string }) => {
  return (
    <li className="max-w-sm list-none overflow-hidden rounded border-4 border-border bg-card">
      <h3 className="bg-border px-4 py-2 text-white">
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
      <p className="px-4 pb-2 text-right">
        <span className="text-3xl font-bold">
          {convert(source.gCo2e, 'grams').to('kg')}
        </span>{' '}
        <span className="">
          kg CO<sub>2</sub>e
        </span>
      </p>
      <p className="px-4 pt-2 text-xs font-bold">Description</p>
      <div
        className="prose prose-sm px-4 pb-2 dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0"
        dangerouslySetInnerHTML={{ __html: source.description }}
      ></div>
      {source.links && (
        <>
          <p className="px-4 pt-2 text-xs font-bold">Links</p>
          <ul className="px-4 pb-2 ">
            {source.links.map((link) => {
              const url = new URL(link.url)
              return (
                <li key={link.id}>
                  <a href={url.href} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>{' '}
                  {link.mediaType !== 'text/html' && (
                    <span className="text-sm text-gray-400">
                      {link.mediaType.split('/').at(-1)?.toUpperCase()}{' '}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{url.hostname}</span>{' '}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </li>
  )
}

export default Source
