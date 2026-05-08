'use server'

import { runServerAction } from '@/adapter/effect'
import { Session } from '@/adapter/session'

export const logout = async () => {
  await Session.deleteSession().pipe(runServerAction('logout'))
}
