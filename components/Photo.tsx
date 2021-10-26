import { NavigationProp, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Image, Text, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { PhotoProps, RootStackParamList } from "../propTypes";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { MutationUpdaterFn } from "@apollo/client";
import {
  toggleLike,
  toggleLikeVariables,
} from "../screens/__generated__/toggleLike";
import moment from "moment";
import { seeFeedNative_seeFeedNative } from "../screens/__generated__/seeFeedNative";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const Body = styled.View`
  padding: 10px;
`;
const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Date = styled.Text`
  color: #cecdcd;
  font-size: 13px;
`;

function Photo({
  id,
  isLiked,
  file,
  user,
  likes,
  createdAt,
  caption,
}: seeFeedNative_seeFeedNative) {
  const updateToggleLike: MutationUpdaterFn<toggleLike> = (cache, result) => {
    const ok = result.data?.toggleLike.ok;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation] = useMutation<toggleLike, toggleLikeVariables>(
    TOGGLE_LIKE_MUTATION,
    {
      variables: { id: id },
      update: updateToggleLike,
    }
  );

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height / 3);
    });
  }, [file]);
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user?.username,
      id: user?.id,
    });
  };

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar source={{ uri: user?.avatar! }} resizeMode="cover" />
        <Username>{user?.username}</Username>
      </Header>
      <File
        resizeMode="cover"
        style={{ width, height: imageHeight }}
        source={{ uri: file }}
      />
      <Body>
        <ActionsContainer>
          <Actions>
            <Action onPress={() => toggleLikeMutation()}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                color={isLiked ? "tomato" : "white"}
                size={22}
              />
            </Action>
            <Action
              onPress={() => navigation.navigate("Comments", { photoId: id })}
            >
              <Ionicons name="chatbubble-outline" color="white" size={22} />
            </Action>
          </Actions>
          <Date>{moment(Number(createdAt)).fromNow()}</Date>
        </ActionsContainer>
        <TouchableOpacity
          onPress={() => navigation.navigate("Likes", { photoId: id })}
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user?.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </Body>
    </Container>
  );
}

export default Photo;
