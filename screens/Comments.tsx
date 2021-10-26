import { gql, MutationUpdaterFn, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, ListRenderItem } from "react-native";
import AvoidKeyboard from "../components/AvoidKeyboard";
import Comment from "../components/Comment";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/Separator";
import TextInputForm from "../components/TextInputForm";
import useMe from "../hooks/useMe";
import { CommentsProps } from "../propTypes";
import { COMMENT_FRAGMENT } from "./fragments";
import { createComment } from "./__generated__/createComment";
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
      <Comment comment={comment!} photoId={route.params?.photoId!} />
    );

  const { register, setValue, handleSubmit, getValues, watch } = useForm();

  useEffect(() => {
    register("comment", { required: true });
  }, []);

  const onValid: SubmitHandler<{ comment: string }> = ({ comment }) => {
    if (!creatingComment) {
      createCommentMutation({
        variables: { photoId: route.params?.photoId, payload: comment },
      });
    }
  };

  const { data: userData } = useMe();
  const createCommentUpdate: MutationUpdaterFn<createComment> = (
    cache,
    result
  ) => {
    const { comment } = getValues();
    setValue("comment", "");
    const { ok, id } = result.data!.createComment;
    if (ok && userData) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload: comment,
        user: { ...userData.me },
      };

      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment AnyName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });

      cache.modify({
        id: `Photo:${route.params?.photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });

      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seePhotoComments(prev) {
            return [...prev, newCacheComment];
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading: creatingComment }] = useMutation(
    CREATE_COMMENT_MUTATION,
    { update: createCommentUpdate }
  );

  return (
    <DismissKeyboard>
      <AvoidKeyboard>
        <ScreenLayout loading={loading}>
          <FlatList
            ItemSeparatorComponent={() => <Separator />}
            data={data?.seePhotoComments}
            keyExtractor={(comment) => "" + comment?.id}
            renderItem={renderComment}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            style={{ width: "100%" }}
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
