import { Layer } from 'effect'
import { PassKey } from '../pass-key'
import { Session } from '../session'
import { NodeSdkLive } from '../tracing/NodeSdkLive'
import { reposLive } from './repos'

const nodeLive = Layer.mergeAll(PassKey.Live, NodeSdkLive, Session.Live)
export const mainLive = Layer.merge(reposLive, nodeLive)
export type MainContext = Layer.Layer.Success<typeof mainLive>
