import React from "react";
import { Keyboard, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function DismissKeyboard({ children }: { children: React.ReactNode }) {
  const dissmissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ height: "100%", backgroundColor: "black" }}
      onPress={() => dissmissKeyboard()}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboard;
