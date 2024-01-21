import { Layer } from 'effect'
import { PassKeyLive } from '../pass-key'
import { NodeSdkLive } from '../tracing/NodeSdkLive'
import { reposLive } from './repos'


const nodeLive = Layer.mergeAll(PassKeyLive, NodeSdkLive)
export const mainLive = Layer.merge(reposLive, nodeLive)
