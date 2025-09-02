import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
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
export type GetCharactersData = { characters: Character[] };

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
