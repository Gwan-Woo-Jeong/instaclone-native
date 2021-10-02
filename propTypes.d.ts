import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined | { username: string; password: string };
  CreateAccount: undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, "Welcome">;
export type LogInProps = StackScreenProps<RootStackParamList, "LogIn">;
export type CreateAccountProps = StackScreenProps<
  RootStackParamList,
  "CreateAccount"
>;
