import { NavigationProp, useNavigation } from "@react-navigation/core";
import { gql, MutationUpdaterFn, useMutation } from "@apollo/client";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { RootStackParamList } from "../propTypes";
import {
  seeProfile,
  seeProfile_seeProfile,
  seeProfile_seeProfile_photos,
} from "./__generated__/seeProfile";
import {
  unfollowUser,
  unfollowUserVariables,
} from "./__generated__/unfollowUser";
import {
  checkPassword,
  checkPasswordVariables,
} from "./__generated__/checkPassword";
import { followUser, followUserVariables } from "./__generated__/followUser";
import Avatar from "../components/Avatar";
import Dialog from "react-native-dialog";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

const CHECK_PASSWORD_MUTATION = gql`
  mutation checkPassword($username: String!, $password: String!) {
    checkPassword(username: $username, password: $password) {
      ok
      error
    }
  }
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
const ProfileContainer = styled.View``;

const FollowContainer = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const UsernameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const UsernameText = styled.Text`
  color: white;
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

const NoPhoto = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const NoPhotoText = styled.Text`
  color: white;
  font-weight: 600;
`;

const EditProfileBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 5px 10px;
  border-radius: 3px;
  margin-left: 15px;
`;

const EditProfileText = styled.Text`
  color: white;
`;

function ProfileScreen({ seeProfile }: seeProfile) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const numColumns = 3;
  const { width } = useWindowDimensions();
  const renderItem: ListRenderItem<seeProfile_seeProfile_photos | null> = ({
    item: photo,
  }) => (
    <TouchableOpacity
      style={{ width: width / numColumns, height: 100, padding: 2 }}
      onPress={() => {
        navigation.navigate("Photo", { photoId: photo!.id });
      }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: photo!.file }}
      />
    </TouchableOpacity>
  );
  const getFollowBtn = ({ isFollowing, isMe }: seeProfile_seeProfile) => {
    if (isMe) {
      return (
        <EditProfileText onPress={showDialog}>Edit Profile</EditProfileText>
      );
    } else {
      if (isFollowing) {
        return (
          <EditProfileText
            onPress={() => {
              unfollowUser();
            }}
          >
            Unfollow
          </EditProfileText>
        );
      } else {
        return (
          <EditProfileText
            onPress={() => {
              followUser();
            }}
          >
            Follow
          </EditProfileText>
        );
      }
    }
  };

  const unfollowUserUpdate: MutationUpdaterFn<unfollowUser> = (
    cache,
    result
  ) => {
    const { ok } = result.data!.unfollowUser;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${seeProfile?.username}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    cache.modify({
      id: `User:${seeProfile?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const followUserUpdate: MutationUpdaterFn<followUser> = (cache, result) => {
    const { ok } = result.data!.followUser;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${seeProfile?.username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    cache.modify({
      id: `User:${seeProfile?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const [followUser] = useMutation<followUser, followUserVariables>(
    FOLLOW_USER_MUTATION,
    {
      variables: { username: seeProfile?.username! },
      update: followUserUpdate,
    }
  );

  const [unfollowUser] = useMutation<unfollowUser, unfollowUserVariables>(
    UNFOLLOW_USER_MUTATION,
    {
      variables: { username: seeProfile?.username! },
      update: unfollowUserUpdate,
    }
  );

  const [visible, setVisible] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const [passwordInput, setPasswordInput] = useState("");

  const [checkPassword] = useMutation<checkPassword, checkPasswordVariables>(
    CHECK_PASSWORD_MUTATION,
    {
      variables: {
        username: seeProfile?.username!,
        password: passwordInput,
      },
    }
  );

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    const { data } = await checkPassword();
    if (data?.checkPassword.ok) {
      setVisible(false);
      navigation.navigate("EditProfile", {
        password: passwordInput,
      });
    } else {
      alert(data?.checkPassword.error);
      passwordRef.current?.clear();
    }
  };

  return (
    <Container>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description>Please enter your password</Dialog.Description>
        <Dialog.Input
          textInputRef={passwordRef}
          onChangeText={(text) => setPasswordInput(text)}
          secureTextEntry
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSubmit} />
      </Dialog.Container>
      <Header>
        <Avatar
          uri={seeProfile?.avatar!}
          size={120}
          style={{ marginRight: 35 }}
        />
        <ProfileWrapper>
          <ProfileContainer>
            <UsernameContainer>
              <UsernameText>{seeProfile?.username}</UsernameText>
              <EditProfileBtn>
                {seeProfile && getFollowBtn(seeProfile)}
              </EditProfileBtn>
            </UsernameContainer>
            <FollowContainer>
              <FollowText>
                <FollowNumber>{seeProfile?.totalFollowers}</FollowNumber>{" "}
                Followers
              </FollowText>
              <FollowText>
                <FollowNumber>{seeProfile?.totalFollowing}</FollowNumber>{" "}
                Followings
              </FollowText>
            </FollowContainer>
            <NameText>
              {seeProfile?.firstName + " " + seeProfile?.lastName}
            </NameText>
            <BioText>{seeProfile?.bio}</BioText>
          </ProfileContainer>
        </ProfileWrapper>
      </Header>
      <Grid>
        {seeProfile?.photos ? (
          <FlatList
            data={seeProfile.photos}
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

export default ProfileScreen;
