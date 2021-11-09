import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hooks/useMe";
import { MeProps } from "../propTypes";
import ProfileScreen from "./ProfileScreen";
import { seeProfile } from "./__generated__/seeProfile";
import { SEE_PROFILE_QUERY } from "./Profile";

function Me({ navigation }: MeProps) {
  const { data: meData } = useMe();
  const { data, loading, refetch } = useQuery<seeProfile>(SEE_PROFILE_QUERY, {
    variables: { username: meData?.me?.username },
  });

  useEffect(() => {
    navigation.setOptions({
      title: meData?.me?.username,
      headerTitleAlign: "center",
    });
  }, []);

  useEffect(() => {
    const onFocus = navigation.addListener("focus", () => {
      refetch();
    });
    return onFocus;
  }, [navigation]);

  return (
    <ScreenLayout loading={loading}>
      <ProfileScreen seeProfile={data?.seeProfile!} />
    </ScreenLayout>
  );
}

export default Me;
