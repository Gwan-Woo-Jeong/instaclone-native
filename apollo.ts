import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const TOKEN = "token";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar("");
};

const AuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const uploadHttpLink = createUploadLink({
  uri: "https://thin-bulldog-80.loca.lt/graphql",
});

const httpLink = createHttpLink({
  uri: "https://itchy-falcon-97.loca.lt/graphql",
});

// onError(에러 핸들러 Fn)
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log(`Network Error`, networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: {
          keyArgs: false,
          merge: (existing = [], incoming = []) => [...existing, ...incoming],
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: AuthLink.concat(onErrorLink).concat(uploadHttpLink),
  cache,
});

export default client;
