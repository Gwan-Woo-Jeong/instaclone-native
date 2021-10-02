import { TextInput } from "react-native";
import styled from "styled-components/native";

interface InputTextProps {
  lastOne?: boolean;
}

export const InputText = styled.TextInput<InputTextProps>`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px 7px;
  margin-bottom: 8px;
  border-radius: 4px;
  color: white;
  margin-bottom: ${(props) => (props.lastOne ? "15" : "8")}px;
`;

export const onNext = (nextOne: React.RefObject<TextInput>) => {
  nextOne?.current?.focus();
};
