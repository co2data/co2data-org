import { Layer } from 'effect'
import { PassKey } from '../pass-key'
import { Session } from '../session'
import { TracingLive } from '../tracing/TracingLive'
import { reposLive } from './repos'

const nodeLive = Layer.mergeAll(PassKey.Live, Session.Live)
export const mainLive = Layer.merge(reposLive, nodeLive)
export type MainContext = Layer.Layer.Success<typeof mainLive>
