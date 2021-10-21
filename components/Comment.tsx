import React from "react";
import styled from "styled-components/native";
import { CommentProps } from "../propTypes";

const CommentContainer = styled.View`
  flex-direction: row;
  padding: 15px 15px;
`;
const TextContainer = styled.View`
  flex-direction: row;
`;
const Avatar = styled.Image`
  height: 35px;
  width: 35px;
  border-radius: 50px;
`;
const UsernameText = styled.Text`
  color: white;
  margin-left: 10px;
  font-weight: 700;
`;
const CommentText = styled.Text`
  color: white;
  margin-left: 5px;
`;

function Comment({ avatar, username, payload }: CommentProps) {
  return (
    <CommentContainer>
      <Avatar source={{ uri: avatar }} />
      <TextContainer>
        <UsernameText>{username}</UsernameText>
        <CommentText>{payload}</CommentText>
      </TextContainer>
    </CommentContainer>
  );
}

export default Comment;
