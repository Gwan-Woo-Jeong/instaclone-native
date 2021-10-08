import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";

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

const httpLink = createHttpLink({
  uri: "https://tricky-vampirebat-91.loca.lt/graphql",
});

// cache export
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
  link: AuthLink.concat(httpLink),
  cache,
});

export default client;
