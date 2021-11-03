/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me {
  __typename: "User";
  id: number;
  firstName: string;
  lastName: string | null;
  username: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export interface me {
  me: me_me | null;
}
