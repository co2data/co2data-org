import { UserRepositoryLive } from '@/domain/user/repository'
import { Layer } from 'effect'
import { Co2RepositoryLive } from '../../domain/co2/repository'
import { SourceRepositoryLive } from '../../domain/source/repository'
import { DB } from '../db'

const co2RepoLive = Co2RepositoryLive.pipe(Layer.provide(DB.Live))
const sourceRepoLive = SourceRepositoryLive.pipe(Layer.provide(DB.Live))
const userRepoLive = UserRepositoryLive.pipe(Layer.provide(DB.Live))

export const reposLive = Layer.mergeAll(
  co2RepoLive,
  sourceRepoLive,
  userRepoLive,
)
