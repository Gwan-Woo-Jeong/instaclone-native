/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoomMessages
// ====================================================

export interface RoomMessages_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface RoomMessages {
  __typename: "Message";
  id: number;
  payload: string;
  user: RoomMessages_user;
  read: boolean;
}
