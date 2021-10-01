import React, { useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";

interface InputTextProps {
  lastOne?: boolean;
}

const InputText = styled.TextInput<InputTextProps>`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px 7px;
  margin-bottom: 8px;
  border-radius: 4px;
  color: white;
  margin-bottom: ${(props) => (props.lastOne ? "15" : "8")}px;
`;

// placeholder 바꾸기

function CreateAccount() {
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onNext = (nextOne: React.RefObject<TextInput>) => {
    nextOne?.current?.focus();
  };

  const onDone = () => {
    alert("done");
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        style={{
          width: "100%",
        }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <InputText
          autoFocus
          ref={firstNameRef}
          placeholder="First Name"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onSubmitEditing={() => onNext(lastNameRef)}
        />
        <InputText
          ref={lastNameRef}
          placeholder="Last Name"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onSubmitEditing={() => onNext(userNameRef)}
        />
        <InputText
          ref={userNameRef}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onSubmitEditing={() => onNext(emailRef)}
        />
        <InputText
          ref={emailRef}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => onNext(passwordRef)}
        />
        <InputText
          ref={passwordRef}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="done"
          onSubmitEditing={onDone}
          lastOne={true}
        />
        <AuthButton
          text="Create Account"
          disabled={true}
          onPress={() => null}
        />
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

export default CreateAccount;
