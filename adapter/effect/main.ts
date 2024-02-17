import { Layer } from 'effect'
import { PassKeyLive } from '../pass-key'
import { SessionLive } from '../session'
import { NodeSdkLive } from '../tracing/NodeSdkLive'
import { reposLive } from './repos'

const nodeLive = Layer.mergeAll(PassKeyLive, NodeSdkLive, SessionLive)
export const mainLive = Layer.merge(reposLive, nodeLive)
export type MainContext = Layer.Layer.Success<typeof mainLive>
