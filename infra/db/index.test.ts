import { Effect, Exit } from 'effect'
import { describe, expect, it, test } from 'vitest'
import { DbError } from '.'

describe('effect basics', () => {
  test('error handling', async () => {
    const actual = await Effect.tryPromise({
      try: () => Promise.reject('test'),
      catch: (cause) => new DbError({ cause }),
    }).pipe(Effect.runPromiseExit)

    expect(actual).toStrictEqual(Exit.fail(new DbError({ cause: 'test' })))
  })
})
