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
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  link: AuthLink.concat(httpLink),
  // apollo에게 type을 설정
  // 쿼리들을 전달인자(arg)에 따라 독립된 폴더에 저장
  // seeFeed.offset:0 // seeFeed.offset:2 - 따로 저장하지 마라
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seeFeed: {
            keyArgs: false, // seeFeed에 한해서 쿼리들을 전달인자에 따라 구별시키는 걸 막음
            merge: (existing = [], incoming = []) => [...existing, ...incoming],
          },
        },
      },
    },
  }),
});

export default client;

// 새로운 데이터를 어떻게 처리해야하는지 알려줘야함 - merge
// merge fn 2 args (existing / incoming)
// 둘 중에 하나만 있을 수도 있으니 빈배열을 기본값으로..
