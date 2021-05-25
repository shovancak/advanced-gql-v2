const resolvers = require('../src/resolvers')

describe('resolver', () => {
  test('feed', () => {
    const result = resolvers.Query.feed(null, null, {models: {
      Post: {
        findMany: () => {
          return ['Hello from resolver']
        }
      }
    }})

    expect(result).toEqual(['Hello from resolver'])
  })
})
