/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFeedNative
// ====================================================

export interface seeFeedNative_seeFeedNative_user {
  __typename: "User";
  id: number;
  username: string;
  avatar: string | null;
}

export interface seeFeedNative_seeFeedNative_comments_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface seeFeedNative_seeFeedNative_comments {
  __typename: "Comment";
  id: number;
  user: seeFeedNative_seeFeedNative_comments_user;
  payload: string;
  isMine: boolean;
  createdAt: string;
}

export interface seeFeedNative_seeFeedNative {
  __typename: "Photo";
  id: number;
  file: string;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
  user: seeFeedNative_seeFeedNative_user;
  caption: string | null;
  comments: (seeFeedNative_seeFeedNative_comments | null)[] | null;
  createdAt: string;
  isMine: boolean;
}

export interface seeFeedNative {
  seeFeedNative: (seeFeedNative_seeFeedNative | null)[] | null;
}

export interface seeFeedNativeVariables {
  offset: number;
}
