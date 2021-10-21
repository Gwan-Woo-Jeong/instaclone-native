import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from "react-native";

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 25px 0px 50px 10px;
  width: 95%;
`;

const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 1000px;
  color: white;
  width: 90%;
  margin-right: 10px;
`;

type TextInputFormProps = {
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  onPress?: (event: GestureResponderEvent) => void;
  value?: string;
  placeholder?: string;
};

function TextInputForm({
  onChangeText,
  onSubmitEditing,
  onPress,
  value,
  placeholder,
}: TextInputFormProps) {
  return (
    <InputContainer>
      <TextInput
        blurOnSubmit={false}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        placeholder={placeholder}
        returnKeyLabel="Send Message"
        returnKeyType="send"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={value}
      />
      <TouchableOpacity disabled={!Boolean(value)} onPress={onPress}>
        <Ionicons
          name="send"
          color={!Boolean(value) ? "rgba(255, 255, 255, 0.5)" : "white"}
          size={22}
        />
      </TouchableOpacity>
    </InputContainer>
  );
}

export default TextInputForm;
