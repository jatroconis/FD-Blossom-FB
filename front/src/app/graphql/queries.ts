import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      id
      name
      species
      image
      isFavorite
    }
  }
`;

export type Character = {
  id: number;
  name: string;
  species: string;
  image?: string | null;
  isFavorite?: boolean | null;
};

export type GetCharactersData = {
  characters: Character[];
};
