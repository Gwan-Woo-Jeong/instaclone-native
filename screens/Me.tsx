import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import useMe from "../hooks/useMe";
import { MeProps } from "../propTypes";
import { PHOTO_FRAGMENT } from "./fragments";
import {
  seeProfile,
  seeProfile_seeProfile_photos,
} from "./__generated__/seeProfile";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Container = styled.View`
  background-color: black;
  flex: 1;
`;

const Header = styled.View`
  flex: 0.2;
  flex-direction: row;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;
const Grid = styled.View`
  margin-top: 20px;
  flex: 0.8;
`;

const ProfileWrapper = styled.View`
  flex-direction: row;
`;
const ProfileContainer = styled.View`
  justify-content: center;
`;
const FollowContainer = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const Avatar = styled.Image`
  height: 120px;
  width: 120px;
  border-radius: 500px;
  margin-right: 35px;
`;
const UsernameText = styled.Text`
  color: white;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 800;
`;

const NameText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 7px;
`;
const FollowText = styled.Text`
  color: white;
  margin-right: 10px;
  font-size: 13px;
`;

const FollowNumber = styled(FollowText)`
  font-weight: 700;
`;

const BioText = styled.Text`
  color: white;
  font-size: 14px;
`;

const NoPhoto = styled.View``;
const NoPhotoText = styled.Text``;

const EditProfileBtn = styled.TouchableOpacity``;
const EditProfileText = styled.Text``;

function Me({ navigation }: MeProps) {
  const { data: meData } = useMe();
  const { data } = useQuery<seeProfile>(SEE_PROFILE_QUERY, {
    variables: { username: meData?.me?.username },
  });
  const numColumns = 3;
  const { width } = useWindowDimensions();

  useEffect(() => {
    navigation.setOptions({
      title: meData?.me?.username,
      headerTitleAlign: "center",
    });
  }, []);
  const renderItem: ListRenderItem<seeProfile_seeProfile_photos | null> = ({
    item: photo,
  }) => (
    <TouchableOpacity
      style={{ width: width / numColumns, height: 100, padding: 2 }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: photo!.file }}
      />
    </TouchableOpacity>
  );
  return (
    <Container>
      <Header>
        <Avatar source={{ uri: data?.seeProfile?.avatar! }} />
        <ProfileWrapper>
          <ProfileContainer>
            <UsernameText>{data?.seeProfile?.username}</UsernameText>
            <FollowContainer>
              <FollowText>
                <FollowNumber>{data?.seeProfile?.totalFollowers}</FollowNumber>{" "}
                Followers
              </FollowText>
              <FollowText>
                <FollowNumber>{data?.seeProfile?.totalFollowing}</FollowNumber>{" "}
                Followings
              </FollowText>
            </FollowContainer>
            <NameText>
              {data?.seeProfile?.firstName + " " + data?.seeProfile?.lastName}
            </NameText>
            <BioText>{data?.seeProfile?.bio}</BioText>
          </ProfileContainer>
        </ProfileWrapper>
      </Header>
      <Grid>
        {data?.seeProfile?.photos ? (
          <FlatList
            data={data?.seeProfile?.photos}
            keyExtractor={(photo) => "" + photo?.id}
            renderItem={renderItem}
            numColumns={numColumns}
          />
        ) : (
          <NoPhoto>
            <NoPhotoText>There is no photo yet</NoPhotoText>
          </NoPhoto>
        )}
      </Grid>
    </Container>
  );
}

export default Me;
