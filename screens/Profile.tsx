import React, { useEffect } from "react";
import ScreenLayout from "../components/ScreenLayout";
import { ProfileProps } from "../propTypes";
import ProfileScreen from "./ProfileScreen";
import { PHOTO_FRAGMENT, PROFILE_FRAGMENT } from "./fragments";
import { gql, useQuery } from "@apollo/client";
import { seeProfile } from "./__generated__/seeProfile";

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      ...ProfileFragment
      photos {
        ...PhotoFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
  ${PROFILE_FRAGMENT}
`;

function Profile({ navigation, route }: ProfileProps) {
  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route.params.username,
        headerTitleAlign: "center",
      });
    }
  }, []);

  const { data, loading } = useQuery<seeProfile>(SEE_PROFILE_QUERY, {
    variables: { username: route.params?.username },
  });

  return (
    <ScreenLayout loading={loading}>
      <ProfileScreen seeProfile={data?.seeProfile!} />
    </ScreenLayout>
  );
}

export default Profile;
