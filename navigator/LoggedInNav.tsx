import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UploadNav from "./UploadNav";
import TabsNav from "./TabsNav";
import UploadForm from "../screens/UploadForm";
import { Ionicons } from "@expo/vector-icons";
import MessagesNav from "./MessagesNav";

const Stack = createStackNavigator();

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
      <Stack.Screen
        name="Messages"
        component={MessagesNav}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default LoggedInNav;
