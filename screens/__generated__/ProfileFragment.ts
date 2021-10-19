/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProfileFragment
// ====================================================

export interface ProfileFragment {
  __typename: "User";
  firstName: string;
  lastName: string | null;
  username: string;
  bio: string | null;
  avatar: string | null;
  totalFollowing: number;
  totalFollowers: number;
  isMe: boolean;
  isFollowing: boolean;
}
