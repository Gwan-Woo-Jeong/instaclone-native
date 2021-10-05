import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import UserRow from "../components/UserRow";
import { LikesProps } from "../propTypes";
import { USER_FRAGMENT } from "./fragments";
import {
  seePhotoLikes,
  seePhotoLikesVariables,
  seePhotoLikes_seePhotoLikes,
} from "./__generated__/seePhotoLikes";

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

const Separator = styled.View`
  width: 100%;
  height: 1;
  background-color: rgba(255, 255, 255, 0.2);
`;

function Likes({ route }: LikesProps) {
  const { data, loading, refetch } = useQuery<
    seePhotoLikes,
    seePhotoLikesVariables
  >(LIKES_QUERY, {
    variables: { id: route?.params?.photoId! },
    skip: !route?.params?.photoId, // 파라미터가 없이 likes 페이지로 가면 query를 스킵
  });
  const [refreshing, setRefreshing] = useState(false);

  const renderUser: ListRenderItem<seePhotoLikes_seePhotoLikes | null> = ({
    item: user,
  }) => <UserRow {...user!} />;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // ItemSeparatorComponent : 리스트의 separator. 처음과 마지막 요소에 위와 아래에 구분선이 없음.
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => <Separator />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data?.seePhotoLikes}
        keyExtractor={(item) => "" + item?.id}
        renderItem={renderUser}
        style={{ width: "100%" }}
      ></FlatList>
    </ScreenLayout>
  );
}

export default Likes;
