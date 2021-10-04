import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { FeedProps } from "../propTypes";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "./fragments";
import Photo from "../components/Photo";
import {
  seeFeed,
  seeFeedVariables,
  seeFeed_seeFeed,
} from "./__generated__/seeFeed";

export const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      likes
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

// 화면 제일 밑에 도달했을 때 스킵한 사진들을 인피니트 스크롤링으로 불러옴
function Feed({ navigation }: FeedProps) {
  const [offset, setOffset] = useState(0); // skip하고 있는 이미지 없음 (초기값)
  const { data, loading, refetch, fetchMore } = useQuery<
    seeFeed,
    seeFeedVariables
  >(FEED_QUERY, {
    variables: { offset: 0 },
  }); // fetchMore : 기존 결과를 유지한 채 더 많은 결과를 fetch (pagination)

  // query가 다시 새로운 offset에 해당되는 사진들만 가져와서 렌더시킴
  const renderPhoto: ListRenderItem<seeFeed_seeFeed | null> = ({
    item: photo,
  }) => <Photo {...photo!} />;
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        } // 맨 끝이 아닌 마지막 사진 중간쯤부터 미리 preload
        onEndReachedThreshold={0.02} // 스크롤바가 리스트의 끝이라고 인식하는 위치를 설정 (0 : 끝)
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo?.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}

// 서버로부터 데이터는 다시 받지만 Apollo가 데이터를 어떻게 해야하는지 모르는 상황
// component 또는 list요소에서 state의 변화가 없음 (offset은 여전히 0)
// => 다시 렌더할 필요를 모르고 있음

// cache에는 seeFeed query의 offset 값이 0인 데이터가 있음 (첫렌더)
// seeFeed query offset 2는 완전 다름
// apollo가 두 query가 같다고 생각하게 만들어야함 => 결과를 결합
// [seeFeed.offset(0), seeFeed.offset(2), seeFeed.offset(4) ...]

export default Feed;
