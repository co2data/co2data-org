import { Layer } from 'effect'
import { Co2RepositoryLive } from '../../domain/co2/repository'
import { SourceRepositoryLive } from '../../domain/source/repository'
import { DbLive } from '../db'
import { UserRepositoryLive } from '@/domain/user/repository'
import { PassKeyLive } from '../pass-key'

const co2RepoLive = Co2RepositoryLive.pipe(Layer.provide(DbLive))
const sourceRepoLive = SourceRepositoryLive.pipe(Layer.provide(DbLive))
const userRepoLive = UserRepositoryLive.pipe(Layer.provide(DbLive))

const reposLive = Layer.mergeAll(
  co2RepoLive,
  sourceRepoLive,
  userRepoLive,
  PassKeyLive
)
export const mainLive = reposLive
