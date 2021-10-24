import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, MutationUpdaterFn, useMutation } from "@apollo/client";
import { deleteComment } from "../screens/__generated__/deleteComment";
import { CommentProps } from "../propTypes";
import moment from "moment";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

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
const DeleteButton = styled.TouchableOpacity`
  margin-left: 5px;
`;
const Date = styled.Text`
  color: #cecdcd;
  font-size: 9px;
  margin-left: 5px;
  line-height: 25px;
`;

function Comment({ photoId, comment }: CommentProps) {
  const updateDeleteComment: MutationUpdaterFn<deleteComment> = (
    cache,
    result
  ) => {
    const { ok } = result!.data!.deleteComment;
    if (ok) {
      cache.evict({ id: `Comment:${comment.id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id: comment.id,
    },
    update: updateDeleteComment,
  });

  const onDeletePress = () => {
    deleteCommentMutation();
  };

  return (
    <CommentContainer>
      <Avatar source={{ uri: comment.user.avatar! }} />
      <TextContainer>
        <UsernameText>{comment.user.username}</UsernameText>
        <CommentText>{comment.payload}</CommentText>
        <Date>{moment(Number(comment.createdAt)).fromNow()}</Date>
        {comment.isMine && (
          <DeleteButton onPress={onDeletePress}>
            <Ionicons name="close" color="#505050" size={15} />
          </DeleteButton>
        )}
      </TextContainer>
    </CommentContainer>
  );
}

export default Comment;
