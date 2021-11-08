import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../colors";

interface ButtonProps {
  editMode?: boolean;
}

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${colors.blue};
  padding: ${(props) => (props.editMode ? "12px 7px" : "15px 10px")};
  border-radius: ${(props) => (props.editMode ? "5px" : "3px")};
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  ${(props) => props.editMode && "margin-top: 10px"};
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

interface Props {
  disabled: boolean;
  onPress: () => void;
  text: string;
  loading?: boolean;
  editMode?: boolean;
}

function AuthButton({ disabled, onPress, text, loading, editMode }: Props) {
  return (
    <Button disabled={disabled} onPress={onPress} editMode>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
}

export default AuthButton;
