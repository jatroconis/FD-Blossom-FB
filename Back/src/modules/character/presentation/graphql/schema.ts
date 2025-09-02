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
    isFavorite: Boolean
  }

  type Comment {
    id: Int!
    characterId: Int!
    content: String!
    createdAt: String!
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    gender: String
    origin: String
    favorite: Boolean      # ← nuevo
  }

  type ToggleFavoriteResult { characterId: Int!, isFavorite: Boolean! }

  type Query {
    ping: String!
    characters(filter: CharacterFilter): [Character!]!
    favoriteCharacters: [Character!]!   # ← nuevo (azúcar sintáctico)
    comments(characterId: Int!): [Comment!]!
  }

  type Mutation {
    toggleFavorite(characterId: Int!): ToggleFavoriteResult!
    addComment(characterId: Int!, content: String!): Comment!
    softDeleteCharacter(id: Int!): Boolean!
    restoreCharacter(id: Int!): Boolean!
  }
`;
