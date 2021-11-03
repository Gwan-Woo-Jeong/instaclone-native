import { gql } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText } from "../components/auth/AuthShared";
import useMe from "../hooks/useMe";

interface EditProfileForm {
  bio: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
    $bio: String!
    $avatar: Upload!
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

function EditProfile() {
  const { data } = useMe();
  const { register, handleSubmit, setValue, getValues } =
    useForm<EditProfileForm>({
      defaultValues: {
        firstName: data?.me?.firstName,
        lastName: data?.me?.lastName || "",
        username: data?.me?.username,
        email: data?.me?.email,
        password: "",
        bio: data?.me?.bio || "",
      },
    });
  const bioRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const onValid = () => {};
  useEffect(() => {
    register("bio", { required: true });
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
        ref={bioRef}
        placeholder="Bio"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onChangeText={(text) => setValue("bio", text)}
      />
      <InputText
        autoFocus
        ref={firstNameRef}
        placeholder="First Name"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onChangeText={(text) => setValue("firstName", text)}
      />
      <InputText
        ref={lastNameRef}
        placeholder="Last Name"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        onChangeText={(text) => setValue("lastName", text)}
      />
      <InputText
        ref={userNameRef}
        placeholder="Username"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={(text) => setValue("username", text)}
        editable={false}
        selectTextOnFocus={false}
      />
      <InputText
        ref={emailRef}
        placeholder="Email"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      <InputText
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="done"
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

export default EditProfile;
