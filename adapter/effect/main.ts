import { Layer } from 'effect'
import { PassKeyLive } from '../pass-key'
import { NodeSdkLive } from '../tracing/NodeSdkLive'
import { reposLive } from './repos'
import { SessionLive } from '../session'

const nodeLive = Layer.mergeAll(PassKeyLive, NodeSdkLive, SessionLive)
export const mainLive = Layer.merge(reposLive, nodeLive)
