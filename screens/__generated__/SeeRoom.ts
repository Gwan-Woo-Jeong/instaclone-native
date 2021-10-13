/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SeeRoom
// ====================================================

export interface SeeRoom_seeRoom_messages_user {
  __typename: "User";
  username: string;
  avatar: string | null;
}

export interface SeeRoom_seeRoom_messages {
  __typename: "Message";
  id: number;
  payload: string;
  user: SeeRoom_seeRoom_messages_user;
  read: boolean;
}

export interface SeeRoom_seeRoom {
  __typename: "Room";
  messages: (SeeRoom_seeRoom_messages | null)[] | null;
}

export interface SeeRoom {
  seeRoom: SeeRoom_seeRoom | null;
}

export interface SeeRoomVariables {
  id: number;
}
