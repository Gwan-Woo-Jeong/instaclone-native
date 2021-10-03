import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StackNavFactoryProps } from "../propTypes";
import Feed from "../screens/Feed";
import Me from "../screens/Me";
import Notifications from "../screens/Notifications";
import Photo from "../screens/Photo";
import Profile from "../screens/Profile";
import Search from "../screens/Search";

const Stack = createStackNavigator();

const getFirstScreen = (screenName: string) => {
  if (screenName === "Feed") {
    return <Stack.Screen name="Feed" component={Feed} />;
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

// 피드, 검색, 알림 (탭의 첫 화면) 빼고 같은 스택 네비게이터 (Photo / Profile)를 리턴
function StackNavFactory({ screenName }: StackNavFactoryProps) {
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
      <Stack.Screen name="Photo" component={Photo} />
    </Stack.Navigator>
  );
}

export default StackNavFactory;
