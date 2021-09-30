import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigator/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import {
  Appearance,
  AppearanceProvider,
} from "react-native-appearance";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const preload = async () => {
    const fontToLoad = [Ionicons.font];
    const fontPromises = fontToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [
      require("./assets/logo.png"),
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png",
    ];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    await Promise.all<Promise<void> | Promise<Asset[]>>([
      ...fontPromises,
      ...imagePromises,
    ]);
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }

  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    console.log(colorScheme);
  });


  return (
    <AppearanceProvider>
      <NavigationContainer>
        <LoggedOutNav />
      </NavigationContainer>
    </AppearanceProvider>
  );
}

/* 
styled-components 차이 
native vs web

태그 차이
1. div => View
2. span => Text
3. import 차이
import styled from 'styled-components/native'

appearance
유저가 라이트, 다크 등의 모드 설정이 있는지체크

userInterfaceStyle : 
automatic - 시스템의 테마 설정에 따름
os에 따라 다르게 설정 가능 (dark , light)

  appearance 사용법
*/
