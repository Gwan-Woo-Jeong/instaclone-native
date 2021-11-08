import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

interface ContainerProps {
  editMode?: boolean;
}

const Container = styled.View<ContainerProps>`
  background-color: black;
  flex: 1;
  ${(props) =>
    !props.editMode && "align-items: center; justify-content: center;"}
  padding: 0px 40px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

type Props = {
  children: React.ReactNode;
  editMode?: boolean;
};

function AuthLayout({ children, editMode }: Props) {
  return (
    <DismissKeyboard>
      <Container editMode={editMode}>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        >
          {editMode || (
            <Logo
              resizeMode="contain"
              source={require("../../assets/logo.png")}
            />
          )}
          {children}
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}

export default AuthLayout;
