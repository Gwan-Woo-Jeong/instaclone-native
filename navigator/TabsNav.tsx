import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import TabIcon from "../components/nav/TabIcon";
import useMe from "../hooks/useMe";
import SharedStackNav from "./SharedStackNav";

const Tabs = createBottomTabNavigator();

const ProfileImg = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  ${(props: { focused: boolean }) =>
    props.focused && "border-color: white; border-width: 1px;"};
`;

function TabsNav() {
  const { data } = useMe();
  // 클릭 감지
  // listeners - tabPress (Fn)
  // e.preventDefault - 카메라를 아무리 눌러도 아무일도 안일어남 (기본 액션 차단)
  // listener는 객체 or 함수 형태 (route에 / navigation 접근 가능)
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "rgba(255, 255, 255, 0.3)",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="RootFeed"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="home" />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="RootSearch"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="search" />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            },
          };
        }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="camera" />
          ),
        }}
      />
      <Tabs.Screen
        name="RootNotifications"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="heart" />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="RootMe"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            data?.me?.avatar ? (
              <ProfileImg source={{ uri: data.me.avatar }} focused={focused} />
            ) : (
              <TabIcon focused={focused} color={color} iconName="person" />
            ),
        }}
      >
        {() => <SharedStackNav screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default TabsNav;
