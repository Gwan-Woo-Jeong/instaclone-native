import { gql, MutationUpdaterFn, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  View,
} from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hooks/useMe";
import { RoomProps } from "../propTypes";
import {
  SeeRoom,
  SeeRoomVariables,
  SeeRoom_seeRoom_messages,
} from "./__generated__/SeeRoom";
import { sendMessage } from "./__generated__/sendMessage";
import { Ionicons } from "@expo/vector-icons";

// Error
const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
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
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 1000px;
  color: white;
  width: 90%;
  margin-right: 10px;
`;
const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 25px 0px;
  margin-bottom: 50px;
  width: 95%;
`;
const SendButton = styled.TouchableOpacity``;

function Room({ route, navigation }: RoomProps) {
  const { data: meData } = useMe();
  const { register, setValue, handleSubmit, getValues, watch } = useForm();
  const updateSendMessage: MutationUpdaterFn<sendMessage> = (cache, result) => {
    const { ok, id } = result.data?.sendMessage!;
    console.log(id);
    if (ok && meData) {
      const { message } = getValues();
      // 메시지 보낸 후 비워주기
      setValue("message", "");
      // 캐시에 저장된 객체와 똑같이 만듦
      const messageObj = {
        __typename: "Message",
        id,
        payload: message,
        user: {
          username: meData.me?.username,
          avatar: meData.me?.avatar,
        },
        read: true,
      };
      // 메시지를 캐시에 삽입
      const messageFragment = cache.writeFragment({
        data: messageObj,
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
      });
      cache.modify({
        id: `Room:${route.params?.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading } = useQuery<SeeRoom, SeeRoomVariables>(ROOM_QUERY, {
    // route로 전달한 id로 seeRoom
    variables: { id: route.params!.id },
  });

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  const onValid: SubmitHandler<{ message: string }> = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route.params?.id,
        },
      });
    }
  };

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
      outGoing={message?.user.username !== route.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message?.user.avatar! }} />
      </Author>
      <Message>{message?.payload}</Message>
    </MessageContainer>
  );
  // reverse : old -> new / new -> old
  // ?? : messages가 배열이 아닐 때, 빈 배열 할당
  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();
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
          inverted
          style={{ width: "100%", marginVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={messages}
          // Error : Attempted to assign to read-only property
          // immutable하게 해야함
          keyExtractor={(message) => "" + message?.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            placeholder="Write a message..."
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <SendButton
            disabled={!Boolean(watch("message"))}
            onPress={handleSubmit(onValid)}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message"))
                  ? "rgba(255, 255, 255, 0.5)"
                  : "white"
              }
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}

export default Room;
