import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { isLoggedInVar, logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText, onNext } from "../components/auth/AuthShared";
import { LogInProps } from "../propTypes";
import { login, loginVariables } from "./__generated__/login";

interface LoginForm {
  username: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function LogIn({ route: { params } }: LogInProps) {
  const passwordRef = useRef<TextInput>(null);
  const { register, handleSubmit, setValue, watch } = useForm<LoginForm>({
    defaultValues: {
      username: params?.username,
      password: params?.password,
    },
  });
  const onCompleted = async (data: login) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      await logUserIn(token!);
    }
  };
  const [logInMutation, { loading }] = useMutation<login, loginVariables>(
    LOGIN_MUTATION,
    { onCompleted }
  );
  const onValid: SubmitHandler<LoginForm> = (data) => {
    if (!loading) {
      logInMutation({ variables: { ...data } });
    }
  };

  useEffect(() => {
    register("username", { required: true });
    register("password", { required: true });
  }, [register]);

  return (
    <AuthLayout>
      <InputText
        placeholder="Username"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={(text) => setValue("username", text)}
        autoCapitalize="none"
        value={watch("username")}
      />
      <InputText
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="done"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
        value={watch("password")}
      />
      <AuthButton
        text="Log In"
        loading={loading}
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}

export default LogIn;
