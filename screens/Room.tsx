import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, ListRenderItem } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { RoomProps } from "../propTypes";
import {
  SeeRoom,
  SeeRoomVariables,
  SeeRoom_seeRoom_messages,
} from "./__generated__/SeeRoom";

const ROOM_QUERY = gql`
  query SeeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props: { outGoing: boolean }) =>
    props.outGoing ? "row-reverse" : "row"};
  align-items: flex-end;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 25px;
`;
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0px 10px;
`;
const TextInput = styled.TextInput`
  margin: 25px 0px;
  margin-bottom: 50px;
  width: 95%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 1000px;
  color: white;
`;

function Room({ route, navigation }: RoomProps) {
  const { data, loading } = useQuery<SeeRoom, SeeRoomVariables>(ROOM_QUERY, {
    // route로 전달한 id로 seeRoom
    variables: { id: route.params!.id },
  });

  useEffect(() => {
    // route로 전달한 talkingTo로 Header title 수정
    navigation.setOptions({
      title: `${route.params?.talkingTo?.username}`,
    });
  }, []);

  // 누가 보낸 메시지인가 알아야됨
  // 내가 보낸 메시지 (outGoing = true)
  const renderItem: ListRenderItem<SeeRoom_seeRoom_messages | null> = ({
    item: message,
  }) => (
    <MessageContainer
      outGoing={message?.user.username !== route.params?.talkingTo}
    >
      <Author>
        <Avatar source={{ uri: message?.user.avatar! }} />
      </Author>
      <Message>{message?.payload}</Message>
    </MessageContainer>
  );
  return (
    // 화면 터치 시 키보드 내리기
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      // 키보드와 화면 떨이지게 하기
      keyboardVerticalOffset={70}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          inverted // 최근 메시지가 아래로 감
          style={{ width: "100%" }}
          data={data?.seeRoom?.messages}
          keyExtractor={(message) => "" + message?.id}
          renderItem={renderItem}
        />
        <TextInput
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="Write a message..."
          returnKeyLabel="Send Message"
          returnKeyType="send"
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}

export default Room;
