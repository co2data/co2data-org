import { UserRepository } from '@/domain/user/repository'
import { Layer } from 'effect'
import { Co2Repository } from '../../domain/co2/repository'
import { SourceRepository } from '../../domain/source/repository'
import { DB } from '../db'

const co2RepoLive = Co2Repository.Live.pipe(Layer.provide(DB.Live))
const sourceRepoLive = SourceRepository.Live.pipe(Layer.provide(DB.Live))
const userRepoLive = UserRepository.Live.pipe(Layer.provide(DB.Live))

export const reposLive = Layer.mergeAll(
  co2RepoLive,
  sourceRepoLive,
  userRepoLive,
)
