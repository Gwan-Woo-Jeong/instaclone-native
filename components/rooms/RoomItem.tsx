import { NavigationProp, useNavigation } from "@react-navigation/core";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../../colors";
import useMe from "../../hooks/useMe";
import { RootStackParamList } from "../../propTypes";
import { seeRooms_seeRooms } from "../../screens/__generated__/seeRooms";

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

function RoomItem({ users, unreadTotal, id }: seeRooms_seeRooms) {
  const { data: meData } = useMe();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const talkingTo = users?.find(
    (user) => user?.username !== meData?.me?.username
  );
  const goToRoom = () => {
    navigation.navigate("Room", { id, talkingTo });
  };

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar source={{ uri: talkingTo?.avatar! }} />
        <Data>
          <Username>{talkingTo?.username}</Username>
          <UnreadText>
            {unreadTotal} unread {unreadTotal === 1 ? "message" : "messages"}
          </UnreadText>
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 && <UnreadDot />}</Column>
    </RoomContainer>
  );
}

export default RoomItem;
