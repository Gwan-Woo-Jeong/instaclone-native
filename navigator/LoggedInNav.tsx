import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UploadNav from "./UploadNav";
import TabsNav from "./TabsNav";
import UploadForm from "../screens/UploadForm";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

// 업로드폼만 헤더 보이게 하기
function LoggedInNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
      }}
    >
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={TabsNav}
      />
      <Stack.Screen
        name="UploadNav"
        options={{ headerShown: false }}
        component={UploadNav}
      />
      <Stack.Screen
        name="UploadForm"
        component={UploadForm}
        options={{
          title: "Upload",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerBackImage: ({ tintColor }) => (
            <Ionicons
              style={{ marginLeft: 5, marginBottom: 5 }}
              color={tintColor}
              name="close"
              size={28}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default LoggedInNav;
