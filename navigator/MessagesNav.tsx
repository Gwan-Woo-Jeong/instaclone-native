import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Room from "../screens/Room";
import Rooms from "../screens/Rooms";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "black" },
        headerBackTitleVisible: false,
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Rooms"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons
              color={tintColor}
              name="chevron-down"
              size={34}
              style={{ marginLeft: 5, marginRight: 5 }}
            />
          ),
        }}
        component={Rooms}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}

export default MessagesNav;
