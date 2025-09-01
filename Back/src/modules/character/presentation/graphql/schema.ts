import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Character {
    id: Int!
    name: String!
    status: String!
    species: String!
    gender: String!
    origin: String!
    image: String
    created: String
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    gender: String
    origin: String
  }

  type Query {
    ping: String!
    characters(filter: CharacterFilter): [Character!]!
  }
`;