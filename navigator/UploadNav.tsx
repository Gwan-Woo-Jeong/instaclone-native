import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function UploadNav() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "white",
        tabBarIndicatorStyle: {
          backgroundColor: "white",
          top: 0,
        },
      }}
    >
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "black",
                height: 37,
                shadowOpacity: 0.3,
              },
              headerTintColor: "white",
              headerBackTitleVisible: false,
              headerTitleStyle: { marginBottom: 8 },
              headerBackImage: ({ tintColor }) => (
                <Ionicons
                  style={{ marginLeft: 5, marginBottom: 5 }}
                  color={tintColor}
                  name="close"
                  size={28}
                />
              ),
            }}
          >
            <Stack.Screen
              name="Select"
              component={SelectPhoto}
              options={{ title: "Choose a photo", headerTitleAlign: "center" }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}

export default UploadNav;
