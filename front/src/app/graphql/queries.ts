import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
  query GetCharacters($filter: CharacterFilter) {
    characters(filter: $filter) {
      id
      name
      species
      status
      gender
      origin
      image
      isFavorite
    }
  }
`;

export type Character = {
  id: number;
  name: string;
  species: string;
  status?: string | null;
  gender?: string | null;
  origin?: string | null;
  image?: string | null;
  isFavorite?: boolean | null;
};

export type CharacterFilterInput = {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  favorite?: boolean;
};

export type GetCharactersVars = {
  filter?: CharacterFilterInput;
};

export type GetCharactersData = {
  characters: Character[];
};

// ---- Favoritos
export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($id: Int!) {
    toggleFavorite(characterId: $id) {
      characterId
      isFavorite
    }
  }
`;

export type ToggleFavoriteVars = { id: number };
export type ToggleFavoriteData = {
  toggleFavorite: { characterId: number; isFavorite: boolean };
};

// ---- Comentarios
export const GET_COMMENTS = gql`
  query GetComments($id: Int!) {
    comments(characterId: $id) {
      id
      characterId
      content
      createdAt
    }
  }
`;

export type Comment = {
  id: number;
  characterId: number;
  content: string;
  createdAt: string;
};
export type GetCommentsVars = { id: number };
export type GetCommentsData = { comments: Comment[] };

export const ADD_COMMENT = gql`
  mutation AddComment($id: Int!, $content: String!) {
    addComment(characterId: $id, content: $content) {
      id
      characterId
      content
      createdAt
    }
  }
`;

export type AddCommentVars = { id: number; content: string };
export type AddCommentData = { addComment: Comment };

export const SOFT_DELETE = gql`
  mutation SoftDelete($id: Int!) {
    softDeleteCharacter(id: $id)
  }
`;
export type SoftDeleteVars = { id: number };
export type SoftDeleteData = { softDeleteCharacter: boolean };

export const RESTORE_CHARACTER = gql`
  mutation Restore($id: Int!) {
    restoreCharacter(id: $id)
  }
`;
export type RestoreVars = { id: number };
export type RestoreData = { restoreCharacter: boolean };