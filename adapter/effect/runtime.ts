import { ManagedRuntime } from 'effect'
import 'server-only'
import { mainLive } from './main'

export default ManagedRuntime.make(mainLive)
