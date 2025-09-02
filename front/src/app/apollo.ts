import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const apollo = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_API_URL as string }),
  cache: new InMemoryCache(),
});
