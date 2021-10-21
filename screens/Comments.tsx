import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, ListRenderItem } from "react-native";
import AvoidKeyboard from "../components/AvoidKeyboard";
import Comment from "../components/Comment";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import TextInputForm from "../components/TextInputForm";
import { CommentsProps } from "../propTypes";
import { COMMENT_FRAGMENT } from "./fragments";
import {
  seePhotoComments,
  seePhotoComments_seePhotoComments,
} from "./__generated__/seePhotoComments";

/* 
comments 보여주기
1. photo에서 navigate 할 때 photoId 가져오기 -> seePhotoComments
2. FlatList로 만들기
3. comment 띄우기
4. css 입히기

comments 만들기
1. textinput 만들기
2. react-hook-form 연결
3. form 완성 시, createComment mutation 실행
----------------------------------
(cache update)
1. createComment mutation에 update fn 연결
2. cache.modify로 comment 추가

comment 지우기
1. comment에 삭제 버튼 만들기
2. 삭제 버튼 클릭 시, deleteComment Mutation 실행
3. cache evict로 comment 삭제
*/

const SEE_PHOTO_COMMENTS_QUERY = gql`
  query seePhotoComments($id: Int!) {
    seePhotoComments(id: $id) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
    }
  }
`;

function Comments({ route }: CommentsProps) {
  const { data, loading } = useQuery<seePhotoComments>(
    SEE_PHOTO_COMMENTS_QUERY,
    {
      variables: { id: route.params?.photoId },
    }
  );

  const renderComment: ListRenderItem<seePhotoComments_seePhotoComments | null> =
    ({ item: comment }) => (
      <Comment
        avatar={comment?.user.avatar!}
        username={comment?.user.username!}
        payload={comment?.payload!}
      />
    );

  const { register, setValue, handleSubmit, getValues, watch } = useForm();

  useEffect(() => {
    register("comment", { required: true });
  }, []);

  const [createCommentMutation, { loading: creatingComment }] = useMutation(
    CREATE_COMMENT_MUTATION
  );

  const onValid: SubmitHandler<{ comment: string }> = ({ comment }) => {
    if (!creatingComment) {
      createCommentMutation({
        variables: { photoId: route.params?.photoId, payload: comment },
      });
    }
  };

  return (
    <DismissKeyboard>
      <AvoidKeyboard>
        <ScreenLayout loading={loading}>
          <FlatList
            data={data?.seePhotoComments}
            keyExtractor={(comment) => "" + comment?.id}
            renderItem={renderComment}
          />
          <TextInputForm
            placeholder="Write a comment..."
            onChangeText={(text) => setValue("comment", text)}
            onSubmitEditing={handleSubmit(onValid)}
            onPress={handleSubmit(onValid)}
            value={watch("comment")}
          />
        </ScreenLayout>
      </AvoidKeyboard>
    </DismissKeyboard>
  );
}

export default Comments;
