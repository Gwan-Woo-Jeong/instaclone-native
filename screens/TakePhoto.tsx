import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Camera } from "expo-camera";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

// 1. 권한 요청

function TakePhoto() {
  const [ok, setOk] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync(); // canAskAgain, expires, granted : true, status
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
  }, []);
  return (
    <Container>
      <Camera type={cameraType} style={{ flex: 1 }} />
    </Container>
  );
}
// Camera 옵션 : docs.expo.io/v40.0.0/sdk/camera/#type

export default TakePhoto;
