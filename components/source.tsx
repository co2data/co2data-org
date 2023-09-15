import { Source } from '@/domain/source'
import { format } from '@/lib/utils'
import convert from 'convert'
import { Option } from 'effect'
import { ExternalLink } from 'lucide-react'
import mime from 'mime'

const Source = ({ source, unit }: { source: Source; unit: string }) => {
  const linksOrNull = Option.getOrNull(source.links)
  return (
    <li className="max-w-sm list-none overflow-hidden rounded border-4 border-border bg-card">
      <h3 className="bg-border px-4 py-2 text-white">
        {source.name}
        {source.region && (
          <>
            &ensp;&bull;&ensp;
            <span className="text-right text-sky-200">{source.region}</span>
          </>
        )}
        {source.year && (
          <>
            &ensp;&bull;&ensp;
            <span className="text-right font-bold">{source.year}</span>
          </>
        )}
      </h3>
      <p className="px-4 pt-2">
        CO<sub>2</sub>e for {source.per} {unit}
      </p>
      <p className="px-4 pb-2 text-right">
        <span className="text-3xl font-bold">
          {format(convert(source.gCo2e, 'grams').to('kg'), {
            trialingZeros: false,
          })}
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
      {linksOrNull && (
        <>
          <p className="px-4 pt-2 text-xs font-bold">
            Links{' '}
            <ExternalLink
              strokeWidth={3}
              className="inline h-3 w-3 align-text-bottom opacity-60"
            />
          </p>
          <ul className="space-y-2 px-4 pb-4 pt-2">
            {linksOrNull.map((link) => {
              const url = new URL(link.url)
              const extension = mime.getExtension(link.mediaType)
              return (
                <li key={link.id}>
                  <a
                    className="underline"
                    href={url.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.name}
                  </a>{' '}
                  {extension && (
                    <>
                      <span className="inline-block rounded border px-1 font-mono text-xs font-bold opacity-60">
                        {extension}
                      </span>{' '}
                    </>
                  )}
                  <span className="text-sm opacity-50">{url.hostname}</span>{' '}
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
