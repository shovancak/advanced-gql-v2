const { ApolloServer, AuthenticationError, UserInputError, ApolloError, SchemaDirectiveVisitor } = require('apollo-server') 
const gql = require('graphql-tag')
const { defaultFieldResolver, GraphQLString } = require('graphql')

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver

    field.args.push({
      type: GraphQLString,
      name: 'message'
    })

    field.resolve = (root, { message, ...rest }, ctx, info) => {
      const { message: schemaMessage } = this.args
      console.log('log directive')
      console.log(message ?? schemaMessage)
      return resolver.call(this, root, rest, ctx, info)
    }
  }

}

const typeDefs = gql`
  directive @log(message: String = "message from directive") on FIELD_DEFINITION

  type User {
    id: ID! @log(message: "id here")
    error: String
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput): Settings!
  }
`

const resolvers = {
  Query: {
    me: () => {
      return {
        id: "1234",
        username: "Scott",
        createdAt: 238741230
      }
    },
    settings: (_, { user }) => {
      return {
        user,
        theme: 'Light'
      }
    } 
  },
  Mutation: {
    settings: (_, { input }) => {
      return input
    }
  },
  Settings: {
    user: (settings) => {
      return {
        id: "1234",
        username: "Scott",
        createdAt: 238741230
      }
    }
  },
  User: {
    error: () => {
      throw new AuthenticationError('Not authenticated.')
    }
  },
}

const server = new ApolloServer({
  resolvers,
  typeDefs,
  schemaDirectives: {
    log: LogDirective,
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 ApolloServer running at ${url}.`)
})