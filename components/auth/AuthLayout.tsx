import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: black;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 40px;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
`;

type Props = {
  children: React.ReactNode;
};

// input 바깥의 터치가 있으면 감지
function AuthLayout({ children }: Props) {
  // react native keyboard API의 dismiss
  const dissmissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ height: "100%" }}
      onPress={() => dissmissKeyboard()}
    >
      <Container>
        <Logo resizeMode="contain" source={require("../../assets/logo.png")} />
        {children}
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default AuthLayout;
