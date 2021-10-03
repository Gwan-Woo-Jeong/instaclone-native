import { Ionicons } from "@expo/vector-icons";
import React from "react";

type TabIconProps = {
  focused: boolean;
  iconName: any;
  color: string;
};

function TabIcon({ focused, iconName, color }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={focused ? 24 : 20}
    />
  );
}

export default TabIcon;
