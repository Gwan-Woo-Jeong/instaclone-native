import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText } from "../components/auth/AuthShared";

function EditProfile() {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const onValid = () => {};
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
