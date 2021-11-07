import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image } from "react-native";
import { SharedStackNavProps } from "../propTypes";
import Comments from "../screens/Comments";
import EditProfile from "../screens/EditProfile";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Me from "../screens/Me";
import Notifications from "../screens/Notifications";
import PhotoScreen from "../screens/PhotoScreen";
import Profile from "../screens/Profile";
import Search from "../screens/Search";

const Stack = createStackNavigator();

const getFirstScreen = (screenName: string) => {
  if (screenName === "Feed") {
    return (
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerMode: "screen",
          headerTitle: () => (
            <Image
              style={{ maxHeight: 40, maxWidth: 120 }}
              resizeMode="contain"
              source={require("../assets/logo.png")}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
    );
  } else if (screenName === "Search") {
    return <Stack.Screen name="Search" component={Search} />;
  } else if (screenName === "Notifications") {
    return <Stack.Screen name="Notifications" component={Notifications} />;
  } else if (screenName === "Me") {
    return <Stack.Screen name="Me" component={Me} />;
  } else {
    return null;
  }
};

function SharedStackNav({ screenName }: SharedStackNavProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "black",
          shadowColor: "rgba(255, 255, 255, 0.3)",
        },
        headerTintColor: "white",
      }}
    >
      {getFirstScreen(screenName)}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Photo" component={PhotoScreen} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

export default SharedStackNav;
