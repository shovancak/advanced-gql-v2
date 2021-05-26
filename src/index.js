const {ApolloServer} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')
const { FormatDateDirective } = require('./directives')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective
  },
  context({req, connection}) {
    const context = {...db}
    if (connection) {
      return {...context, ...connection.context}
    }
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return {...context, user, createToken}
  },
  subscriptions: {
    onConnect: (connectionParams) => {
      const token = connectionParams.authToken
      const user = getUserFromToken(token)
      return {user}
    }
  }
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
