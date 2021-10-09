import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../colors";

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  margin-right: 15px;
  font-size: 16px;
  font-weight: 600;
`;

// 파일 정보와 함께 업로드로 이동
const headerRight = (onPress: () => void) => () => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );
};

export default headerRight;
