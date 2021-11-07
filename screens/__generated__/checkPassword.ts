/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: checkPassword
// ====================================================

export interface checkPassword_checkPassword {
  __typename: "CheckPasswordResult";
  ok: boolean;
  error: string | null;
}

export interface checkPassword {
  checkPassword: checkPassword_checkPassword;
}

export interface checkPasswordVariables {
  username: string;
  password: string;
}
