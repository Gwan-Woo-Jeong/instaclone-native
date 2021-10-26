import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { seeFeed_seeFeed_user } from "./screens/__generated__/seeFeed";
import { seeRooms_seeRooms_users } from "./screens/__generated__/seeRooms";
import { seePhotoComments_seePhotoComments } from "./screens/__generated__/seePhotoComments";
import { seeFeedNative_seeFeedNative } from "./screens/__generated__/seeFeedNative";

type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined | { username: string; password: string };
  CreateAccount: undefined;
  Search: undefined;
  Photo: undefined | { photoId: number };
  Profile: undefined | { username: string; id: number };
  Feed: undefined;
  Likes: undefined | { photoId: number };
  Comments: undefined | { photoId: number };
  Me: undefined;
  SelectPhoto: undefined;
  TakePhoto: undefined;
  Tabs: undefined;
  UploadForm: undefined | { file: string };
  nextBtn: undefined | { file: string };
  Messages: undefined;
  Room:
    | undefined
    | { id: number; talkingTo: seeRooms_seeRooms_users | null | undefined };
};

export type WelcomeProps = StackScreenProps<RootStackParamList, "Welcome">;
export type LogInProps = StackScreenProps<RootStackParamList, "LogIn">;
export type CreateAccountProps = StackScreenProps<
  RootStackParamList,
  "CreateAccount"
>;
export type SearchProps = StackScreenProps<RootStackParamList, "Search">;
export type PhotoScreenProps = StackScreenProps<RootStackParamList, "Photo">;
export type ProfileProps = StackScreenProps<RootStackParamList, "Profile">;
export type FeedProps = StackScreenProps<RootStackParamList, "Feed">;
export type LikesProps = StackScreenProps<RootStackParamList, "Likes">;
export type CommentsProps = StackScreenProps<RootStackParamList, "Comments">;
export type MeProps = StackScreenProps<RootStackParamList, "Me">;
export type SelectPhotoProps = StackScreenProps<
  RootStackParamList,
  "SelectPhoto"
>;
export type TakePhotoProps = StackScreenProps<RootStackParamList, "TakePhoto">;
export type UploadFormProps = StackScreenProps<
  RootStackParamList,
  "UploadForm"
>;
export type RoomProps = StackScreenProps<RootStackParamList, "Room">;
export type CommentsProps = StackScreenProps<RootStackParamList, "Comments">;

export type SharedStackNavProps = {
  screenName: string;
};

export type ScreenLayoutProps = {
  loading: boolean;
  children: React.ReactNode;
  base?: boolean;
};

export type CommentProps = {
  comment: seePhotoComments_seePhotoComments;
  photoId: number;
};

export type PhotoProps = {
  photo: seeFeedNative_seeFeedNative;
};
