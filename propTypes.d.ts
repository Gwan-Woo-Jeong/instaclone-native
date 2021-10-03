import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined | { username: string; password: string };
  CreateAccount: undefined;
  Search: undefined;
  Photo: undefined;
  Profile: undefined;
  Feed: undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, "Welcome">;
export type LogInProps = StackScreenProps<RootStackParamList, "LogIn">;
export type CreateAccountProps = StackScreenProps<
  RootStackParamList,
  "CreateAccount"
>;
export type SearchProps = StackScreenProps<RootStackParamList, "Search">;
export type PhotoProps = StackScreenProps<RootStackParamList, "Photo">;
export type ProfileProps = StackScreenProps<RootStackParamList, "Profile">;
export type FeedProps = StackScreenProps<RootStackParamList, "Feed">;

export type StackNavFactoryProps = {
  screenName: string;
};
