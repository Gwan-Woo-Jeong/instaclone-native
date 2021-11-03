import React from "react";
import { ImageStyle, StyleProp } from "react-native";
import styled from "styled-components/native";
import avatar from "../images/avatar.png";

const Image = styled.Image<{ size: number }>`
  border-radius: 1000000px;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
`;

type AvatarProps = {
  uri: string | null;
  size: number;
  style?: StyleProp<ImageStyle>;
};

function Avatar({ uri, size, style }: AvatarProps) {
  return <Image source={{ uri: uri || avatar }} size={size} style={style} />;
}

export default Avatar;
