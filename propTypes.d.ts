import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { seeFeed_seeFeed_user } from "./screens/__generated__/seeFeed";

type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined | { username: string; password: string };
  CreateAccount: undefined;
  Search: undefined;
  Photo: undefined;
  Profile: undefined | { username: string; id: number };
  Feed: undefined;
  Likes: undefined | { photoId: number };
  Comments: undefined;
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
export type LikesProps = StackScreenProps<RootStackParamList, "Likes">;
export type CommentsProps = StackScreenProps<RootStackParamList, "Comments">;

export type SharedStackNavProps = {
  screenName: string;
};

export type ScreenLayoutProps = {
  loading: boolean;
  children: React.ReactNode;
};

export type PhotoComponentProps = {
  id: number;
  user: seeFeed_seeFeed_user;
  caption: string | null;
  file: string;
  isLiked: boolean;
  likes: number;
};
