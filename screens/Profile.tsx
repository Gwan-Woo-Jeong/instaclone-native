import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ProfileProps } from "../propTypes";

function Profile({ navigation, route }: ProfileProps) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route.params.username,
        headerTitleAlign: "center",
      });
    }
  }, []);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Someone's Profile</Text>
    </View>
  );
}

export default Profile;
