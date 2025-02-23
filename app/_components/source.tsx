import type { Source } from '@/domain/source'
import { format } from '@/lib/utils'
import convert from 'convert'
import { Option } from 'effect'
import { ExternalLink } from 'lucide-react'
import mime from 'mime'
import Opt from './opt'

const SourceComponent = ({
  source,
  unit,
}: { source: Source; unit: string }) => {
  return (
    <li className="max-w-sm list-none overflow-hidden rounded border-4 border-border bg-card">
      <h3 className="bg-border px-4 py-2 text-white">
        {source.name}
        <Opt>
          {Option.map(source.region, (_) => (
            <>
              &ensp;&bull;&ensp;
              <span className="text-right text-sky-200">{_}</span>
            </>
          ))}
        </Opt>
        <Opt>
          {Option.map(source.year, (_) => (
            <>
              &ensp;&bull;&ensp;
              <span className="text-right font-bold">{_}</span>
            </>
          ))}
        </Opt>
      </h3>
      <p className="px-4 pt-2">
        CO<sub>2</sub>e for {source.per} {unit}
      </p>
      <p className="px-4 pb-2 text-right">
        <span className="font-bold text-3xl">
          {format(convert(source.gCo2e, 'grams').to('kg'), {
            trialingZeros: false,
          })}
        </span>{' '}
        <span className="">
          kg CO<sub>2</sub>e
        </span>
      </p>
      <p className="px-4 pt-2 font-bold text-xs">Description</p>
      <div
        className="prose prose-sm dark:prose-invert prose-li:my-0 prose-p:my-1 prose-ul:my-1 px-4 pb-2"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: source.description }}
      />
      <Opt>
        {Option.map(source.links, (links) => (
          <>
            <p className="px-4 pt-2 font-bold text-xs">
              Links{' '}
              <ExternalLink
                strokeWidth={3}
                className="inline h-3 w-3 align-text-bottom opacity-60"
              />
            </p>
            <ul className="space-y-2 px-4 pt-2 pb-4">
              {links.map((link) => {
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
                        <span className="inline-block rounded border px-1 font-bold font-mono text-xs opacity-60">
                          {extension}
                        </span>{' '}
                      </>
                    )}
                    <span className="text-sm opacity-50">
                      {url.hostname}
                    </span>{' '}
                  </li>
                )
              })}
            </ul>
          </>
        ))}
      </Opt>
    </li>
  )
}

export default SourceComponent
