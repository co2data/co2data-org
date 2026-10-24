'use server'

import { runServerAction } from '@/adapter/effect'
import { Session } from '@/adapter/session'

export const logout = async () => {
  await Session.use((session) => session.deleteSession()).pipe(
    runServerAction('logout'),
  )
}
