import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ListRenderItem } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { colors } from "../colors";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/Separator";
import useMe from "../hooks/useMe";
import { ROOM_FRAGMENT } from "./fragments";
import { seeRooms, seeRooms_seeRooms } from "./__generated__/seeRooms";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

const RoomContainer = styled.TouchableOpacity`
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 20px;
`;

const Data = styled.View``;

const UnreadDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${colors.blue};
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const UnreadText = styled.Text`
  color: white;
  margin-top: 2px;
  font-weight: 400;
`;

function Rooms() {
  const { data, loading } = useQuery<seeRooms>(SEE_ROOMS_QUERY);
  const { data: meData } = useMe();
  const renderItem: ListRenderItem<seeRooms_seeRooms> = ({ item: room }) => {
    const notMe = room.users?.find(
      // find : 조건을 만족하는 첫 번째 유저를 찾음
      (user) => user?.username !== meData?.me?.username
    );
    return (
      <RoomContainer>
        <Column>
          <Avatar source={{ uri: notMe?.avatar! }} />
          <Data>
            <Username>{notMe?.username}</Username>
            <UnreadText>
              {room.unreadTotal} unread{" "}
              {room.unreadTotal === 1 ? "message" : "messages"}
            </UnreadText>
          </Data>
        </Column>
        <Column>{room.unreadTotal !== 0 && <UnreadDot />}</Column>
      </RoomContainer>
    );
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={Separator}
        style={{ width: "100%" }}
        data={data?.seeRooms}
        keyExtractor={(room) => "" + room.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}

export default Rooms;
