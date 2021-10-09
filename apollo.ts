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

// links. authLink -> httpLink 이유
// http가 서버에 마지막으로 요청하는 link. 후에 다른 어떤 일도 하면 안됨
// ** onErrorLink : 에러를 확인하고 알림을 줄임

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

// 헤더 세팅, 에러 콘솔로그, 서버 요청
const client = new ApolloClient({
  // httpLink가 ReactNativeFile을 어떻게 다뤄야할지 모름
  // => createUploadLink로 업로드 링크를 만듦
  // 서버에 파일을 업로드할 때, json이 아닌 다른 형태로 보냄
  link: AuthLink.concat(onErrorLink).concat(uploadHttpLink),
  cache,
});

export default client;
