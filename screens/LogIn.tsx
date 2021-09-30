import { Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

function LogIn({ navigation }: any) {
  return (
    <View>
      <Text>LogIn</Text>
      <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
        <View>
          <Text>Go to Create Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default LogIn;
