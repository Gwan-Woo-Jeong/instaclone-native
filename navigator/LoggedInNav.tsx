import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Feed from "../screens/Feed";
import Notifications from "../screens/Notifications";
import Search from "../screens/Search";
import { View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import Me from "../screens/Me";
import StackNavFactory from "./StackNavFactory";

const Tabs = createBottomTabNavigator();

// tab navi의 모든 tab에 stack navi를 만들어야함
// tab 메뉴에서 사진 목록을 보다가 사진을 클릭하면
// 다른 stack이 위로 올라옴
// tab 안에 stack이 있다
// stack의 첫번째 화면이 Tab 화면
// 그 후 다른 화면은 전부 shared 화면

// children으로 컴포넌트 보내기
// component를 <Tabs.Screen> 안에 컴포넌트를 리턴하는 함수

// Found screens with the same name nested inside one another. Check:
// 부모와 자식 컴포넌트 이름이 같을 때 생기는 에러

function LoggedInNav() {
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
        {() => <StackNavFactory screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="RootSearch"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="search" />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
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
        {() => <StackNavFactory screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="RootMe"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} color={color} iconName="person" />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default LoggedInNav;
