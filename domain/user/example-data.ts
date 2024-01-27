import { Option } from 'effect'
import { User } from '.'

export function makeUser(override: Partial<User> = {}) {
  return {
    id: '1',
    email: 'philip@co2data.org',
    currentChallenge: Option.none(),
    authenticators: [],
    ...override,
  } satisfies User
}
