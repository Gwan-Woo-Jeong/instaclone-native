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
import { FlatList, ListRenderItem, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hooks/useMe";
import { RoomProps } from "../propTypes";
import {
  seeRoom,
  seeRoomVariables,
  seeRoom_seeRoom_messages,
} from "./__generated__/SeeRoom";
import { sendMessage } from "./__generated__/sendMessage";
import { MESSAGE_FRAGMENT } from "./fragments";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import TextInputForm from "../components/TextInputForm";
import DismissKeyboard from "../components/DismissKeyboard";
import AvoidKeyboard from "../components/AvoidKeyboard";
import Avatar from "../components/Avatar";

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

const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0px 10px;
`;

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
    seeRoom,
    seeRoomVariables
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

  const renderItem: ListRenderItem<seeRoom_seeRoom_messages | null> = ({
    item: message,
  }) => (
    <MessageContainer
      outGoing={message?.user.username !== route.params?.talkingTo?.username}
    >
      <Author>
        <Avatar uri={message?.user.avatar!} size={20} />
      </Author>
      <Message>{message?.payload}</Message>
    </MessageContainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();

  return (
    <DismissKeyboard>
      <AvoidKeyboard>
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
          <TextInputForm
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            onPress={handleSubmit(onValid)}
            value={watch("message")}
            placeholder="Write a message..."
          />
        </ScreenLayout>
      </AvoidKeyboard>
    </DismissKeyboard>
  );
}

export default Room;
