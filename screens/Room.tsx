import {
  gql,
  MutationUpdaterFn,
  Reference,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
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
import { MESSAGE_FRAGMENT } from "./fragments";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";

// subscription
const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      ...RoomMessages
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        ...RoomMessages
      }
    }
  }
  ${MESSAGE_FRAGMENT}
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

// useSubscription으로 data를 가져오면? 새로운 메시지가 올 때마다 캐시 업데이트
// hook 사용할 필요 X => subscribeToMore
function Room({ route, navigation }: RoomProps) {
  const { data: meData } = useMe();
  const { register, setValue, handleSubmit, getValues, watch } = useForm();
  const updateSendMessage: MutationUpdaterFn<sendMessage> = (cache, result) => {
    const { ok, id } = result.data?.sendMessage!;
    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
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

      const messageFragment = cache.writeFragment({
        data: messageObj,
        fragment: MESSAGE_FRAGMENT,
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

  // 첫 번째로 useQuery로 room의 메시지를 받아옴
  // 그 후론 subscribeToMore로 업데이트 - 캐시에 접근 가능
  const { data, loading, subscribeToMore } = useQuery<
    SeeRoom,
    SeeRoomVariables
  >(ROOM_QUERY, {
    variables: { id: route.params!.id },
  });

  const client = useApolloClient();
  const updateQuery: UpdateQueryFn = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const messageFragment = client.cache.writeFragment({
        data: message,
        fragment: MESSAGE_FRAGMENT,
      });
      client.cache.modify({
        id: `Room:${route.params?.id}`,
        fields: {
          messages(prev) {
            //** incomingMessage가 prev에 있으면 추가하지 않음
            // 중복된 메시지 (없으면 undefined)
            const existingMessage = prev.find(
              (aMessage: Reference) => aMessage.__ref === messageFragment?.__ref
            );
            if (existingMessage) {
              // 중복이 있으면
              return prev; // 아무것도 하지 않음
            }
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (data?.seeRoom && !subscribed) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

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
    navigation.setOptions({
      title: `${route.params?.talkingTo?.username}`,
    });
  }, []);

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

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={70}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          style={{ width: "100%", marginVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={messages}
          keyExtractor={(message) => "" + message?.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            blurOnSubmit={false}
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
