import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import useMe from "../hooks/useMe";
import { MeProps } from "../propTypes";
import { PHOTO_FRAGMENT } from "./fragments";
import { seeProfile } from "./__generated__/seeProfile";

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
`;
const Grid = styled.View``;

const ProfileContainer = styled.View``;
const FollowContainer = styled.View`
  flex-direction: row;
`;
const NameContainer = styled.View``;
const BioContainer = styled.View``;

const Avatar = styled.Image`
  height: 135px;
  width: 135px;
  border-radius: 500px;
  margin-left: 20px;
`;
const UsernameText = styled.Text`
  color: white;
  margin-bottom: 3px;
`;

const NameText = styled.Text`
  color: white;
`;
const FollowText = styled.Text`
  color: white;
`;
const BioText = styled.Text`
  color: white;
`;
const EditProfileBtn = styled.TouchableOpacity``;
const EditProfileText = styled.Text``;

function Me({ navigation }: MeProps) {
  const { data: meData } = useMe();
  const { data } = useQuery<seeProfile>(SEE_PROFILE_QUERY, {
    variables: { username: meData?.me?.username },
  });
  useEffect(() => {
    navigation.setOptions({
      title: meData?.me?.username,
      headerTitleAlign: "center",
    });
  }, []);
  return (
    <Container>
      <Header>
        <Avatar source={{ uri: data?.seeProfile?.avatar! }} />
        <ProfileContainer>
          <UsernameText>{data?.seeProfile?.username}</UsernameText>
          <FollowContainer>
            <FollowText>
              {data?.seeProfile?.totalFollowers} Followers
            </FollowText>
            <FollowText>
              {data?.seeProfile?.totalFollowing} Followings
            </FollowText>
          </FollowContainer>
          <NameText>
            {data?.seeProfile?.firstName + " " + data?.seeProfile?.lastName}
          </NameText>
          <BioText>{data?.seeProfile?.bio}</BioText>
        </ProfileContainer>
      </Header>
      <Grid></Grid>
    </Container>
  );
}

export default Me;
