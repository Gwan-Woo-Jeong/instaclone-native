import { useQuery, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { FeedProps } from "../propTypes";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "./fragments";
import Photo from "../components/Photo";
import {
  seeFeed,
  seeFeedVariables,
  seeFeed_seeFeed,
} from "./__generated__/seeFeed";
import { Ionicons } from "@expo/vector-icons";

export const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        id
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

function Feed({ navigation }: FeedProps) {
  const { data, loading, refetch, fetchMore } = useQuery<
    seeFeed,
    seeFeedVariables
  >(FEED_QUERY, {
    variables: { offset: 0 },
  });

  const renderPhoto: ListRenderItem<seeFeed_seeFeed | null> = ({
    item: photo,
  }) => <Photo {...photo!} />;
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  const [refreshing, setRefreshing] = useState(false);
  const MessagesBtn = () => (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => navigation.navigate("Messages")}
    >
      <Ionicons name="paper-plane" color="white" size={20} />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({ headerRight: MessagesBtn });
  });
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
        onEndReachedThreshold={0.02}
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

export default Feed;
