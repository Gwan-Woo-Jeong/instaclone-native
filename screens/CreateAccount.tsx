import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText, onNext } from "../components/auth/AuthShared";
import { CreateAccountProps } from "../propTypes";
import { createAccount } from "./__generated__/createAccount";

interface CreateAccountForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function CreateAccount({ navigation }: CreateAccountProps) {
  const onCompleted = (data: createAccount) => {
    const {
      createAccount: { ok },
    } = data;
    const { username, password } = getValues();
    if (ok) {
      navigation.navigate("LogIn", { username, password });
    }
  };
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onValid: SubmitHandler<CreateAccountForm> = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  return (
    <AuthLayout>
      <InputText
        autoFocus
        ref={firstNameRef}
        placeholder="First Name"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onSubmitEditing={() => onNext(lastNameRef)}
        onChangeText={(text) => setValue("firstName", text)}
      />
      <InputText
        ref={lastNameRef}
        placeholder="Last Name"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onSubmitEditing={() => onNext(userNameRef)}
        onChangeText={(text) => setValue("lastName", text)}
      />
      <InputText
        ref={userNameRef}
        placeholder="Username"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => onNext(emailRef)}
        onChangeText={(text) => setValue("username", text)}
      />
      <InputText
        ref={emailRef}
        placeholder="Email"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("email", text)}
      />
      <InputText
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onValid)}
        secureTextEntry
        lastOne={true}
        onChangeText={(text) => setValue("password", text)}
      />
      <AuthButton
        text="Create Account"
        disabled={false}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}

export default CreateAccount;
