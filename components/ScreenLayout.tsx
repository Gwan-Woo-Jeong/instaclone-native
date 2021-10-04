import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ScreenLayoutProps } from "../propTypes";

function ScreenLayout({ loading, children }: ScreenLayoutProps) {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <ActivityIndicator color="white" /> : children}
    </View>
  );
}

export default ScreenLayout;
