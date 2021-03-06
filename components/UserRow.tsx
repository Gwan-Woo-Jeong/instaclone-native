import { NavigationProp, useNavigation } from "@react-navigation/core";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../colors";
import { RootStackParamList } from "../propTypes";
import { seePhotoLikes_seePhotoLikes } from "../screens/__generated__/seePhotoLikes";
import Avatar from "./Avatar";

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  color: white;
  font-weight: 600;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
`;

const FollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
`;
const FollowBtnText = styled.Text`
  color: white;
  font-weight: 600;
`;

function UserRow({
  avatar,
  username,
  isFollowing,
  isMe,
  id,
}: seePhotoLikes_seePhotoLikes) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Wrapper>
      <Column
        onPress={() => {
          navigation.navigate("Profile", {
            username,
            id,
          });
        }}
      >
        <Avatar uri={avatar!} size={40} style={{ marginRight: 10 }} />
        <Username>{username}</Username>
      </Column>
      {!isMe && (
        <FollowBtn>
          <FollowBtnText>{isFollowing ? "unfollow" : "follow"}</FollowBtnText>
        </FollowBtn>
      )}
    </Wrapper>
  );
}

export default UserRow;
