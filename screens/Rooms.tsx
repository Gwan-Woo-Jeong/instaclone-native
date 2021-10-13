import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ListRenderItem } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import RoomItem from "../components/rooms/RoomItem";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/Separator";
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

function Rooms() {
  const { data, loading } = useQuery<seeRooms>(SEE_ROOMS_QUERY);
  // const { data: meData } = useMe();
  const renderItem: ListRenderItem<seeRooms_seeRooms> = ({ item: room }) => {
    return <RoomItem {...room} />;
    // const notMe = room.users?.find(
    //   // find : 조건을 만족하는 첫 번째 유저를 찾음
    //   (user) => user?.username !== meData?.me?.username
    // );
    // return (
    //   <RoomContainer>
    //     <Column>
    //       <Avatar source={{ uri: notMe?.avatar! }} />
    //       <Data>
    //         <Username>{notMe?.username}</Username>
    //         <UnreadText>
    //           {room.unreadTotal} unread{" "}
    //           {room.unreadTotal === 1 ? "message" : "messages"}
    //         </UnreadText>
    //       </Data>
    //     </Column>
    //     <Column>{room.unreadTotal !== 0 && <UnreadDot />}</Column>
    //   </RoomContainer>
    // );
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
