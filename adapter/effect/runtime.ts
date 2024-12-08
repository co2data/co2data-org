import { ManagedRuntime } from 'effect'
import { mainLive } from './main'

export default ManagedRuntime.make(mainLive)
