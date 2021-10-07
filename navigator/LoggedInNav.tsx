import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Upload from "../screens/Upload";
import TabsNav from "./TabsNav";

const Stack = createStackNavigator();

function LoggedInNav() {
  // headerShown - 헤더 감추기
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
}
// (+ Stack )- Camera
// (+ Stack ) - Tabs - Stack
// 카메라 아이콘을 선택했을 때 다른 스크린으로 넘어가기 위함
// 밑에 있는 탭들이 더 이상 안보이게

export default LoggedInNav;
