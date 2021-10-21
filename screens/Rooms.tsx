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
  const renderItem: ListRenderItem<seeRooms_seeRooms> = ({ item: room }) => {
    return <RoomItem {...room} />;
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
