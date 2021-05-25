const { ApolloServer, AuthenticationError, UserInputError, ApolloError } = require('apollo-server') 
const gql = require('graphql-tag')

const typeDefs = gql`
  type User {
    id: ID!
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
})

server.listen().then(({ url }) => {
  console.log(`🚀 ApolloServer running at ${url}.`)
})