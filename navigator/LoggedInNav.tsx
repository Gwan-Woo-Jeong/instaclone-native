import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UploadNav from "./UploadNav";
import TabsNav from "./TabsNav";

const Stack = createStackNavigator();

function LoggedInNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="UploadNav" component={UploadNav} />
    </Stack.Navigator>
  );
}

export default LoggedInNav;
