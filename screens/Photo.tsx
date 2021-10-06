import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { PhotoProps } from "../propTypes";
import { PHOTO_FRAGMENT } from "./fragments";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
    }
  }
  ${PHOTO_FRAGMENT}
`;

// fullView가 있으면 Comment 보여주기
function PhotoScreen({ route, navigation }: PhotoProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEE_PHOTO, {
    variables: { id: route.params?.photoId },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // 새로고침
  // RefreshControl 컴포넌트 필요
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ backgroundColor: "black" }}
        contentContainerStyle={{
          backgroundColor: "black",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Photo {...data?.seePhoto} />
      </ScrollView>
    </ScreenLayout>
  );
}

export default PhotoScreen;
