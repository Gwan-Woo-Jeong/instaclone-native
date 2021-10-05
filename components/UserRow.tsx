import { useNavigation } from "@react-navigation/core";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../colors";
import { seePhotoLikes_seePhotoLikes } from "../screens/__generated__/seePhotoLikes";

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
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

// 팔로우 언팔로우 버튼

function UserRow({
  avatar,
  username,
  isFollowing,
  isMe,
  id,
  
}: seePhotoLikes_seePhotoLikes) {
  const navigation = useNavigation();
  return (
    <Wrapper>
      <Column onPress={() => navigation.navigate("Profile", {})}>
        <Avatar source={{ uri: avatar! }} />
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
