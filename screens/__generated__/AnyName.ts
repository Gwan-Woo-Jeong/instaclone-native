/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AnyName
// ====================================================

export interface AnyName_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface AnyName {
  __typename: "Comment";
  id: number;
  createdAt: string;
  isMine: boolean;
  payload: string;
  user: AnyName_user;
}
