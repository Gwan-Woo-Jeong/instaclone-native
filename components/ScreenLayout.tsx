import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { ScreenLayoutProps } from "../propTypes";

const Container = styled.View<{ base?: boolean }>`
  background-color: black;
  flex: 1;
  align-items: ${(props) => (props.base ? "center" : "baseline")};
  justify-content: center;
`;

function ScreenLayout({ loading, children, base }: ScreenLayoutProps) {
  return (
    <Container base={base}>
      {loading ? <ActivityIndicator color="white" /> : children}
    </Container>
  );
}

export default ScreenLayout;
