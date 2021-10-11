import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import { Alert, Image, StatusBar, Text } from "react-native";
import { TakePhotoProps } from "../propTypes";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/core";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Actions = styled.View`
  flex: 0.35;
  padding: 0px 50px;
  align-items: center;
  justify-content: space-around;
`;

const PhotoActions = styled(Actions)`
  flex-direction: row;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.8);
`;

const SliderContainer = styled.View``;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const PhotoAction = styled.TouchableOpacity`
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;

const PhotoActionText = styled.Text`
  font-weight: 600;
`;

function TakePhoto({ navigation }: TakePhotoProps) {
  const camera = useRef<Camera>(null);
  const [ok, setOk] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<FlashMode>(
    Camera.Constants.FlashMode.off
  );
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.back
  );
  const [takenPhoto, setTakenPhoto] = useState<string>("");

  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    setOk(granted);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const onZoomValueChange = (e: number) => {
    setZoom(e);
  };

  const onFlashChange = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto);
    } else if (flashMode === Camera.Constants.FlashMode.auto) {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };

  const getFlashIcon = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      return "flash-off";
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      return "flash";
    } else if (flashMode === Camera.Constants.FlashMode.auto) {
      return "eye";
    }
  };

  const takePhoto = async () => {
    if (camera.current && cameraReady) {
      const { uri } = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      setTakenPhoto(uri);
    }
  };

  const onUpload = () => {
    Alert.alert("Save photo?", "Save Photo & upload or just upload", [
      { text: "Save & Upolad", onPress: () => goToUpload(true) },
      { text: "Just upload", onPress: () => goToUpload(false) },
    ]);
  };

  const goToUpload = async (save: boolean) => {
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    // 파일 정보와 함께 업로드로 이동
    navigation.navigate("UploadForm", { file: takenPhoto });
  };

  const onDissmiss = () => setTakenPhoto("");
  const isFocused = useIsFocused();

  return (
    <Container>
      {isFocused && <StatusBar hidden={true} />}
      {takenPhoto === "" && isFocused ? (
        <Camera
          type={cameraType}
          style={{ flex: 1 }}
          zoom={zoom}
          flashMode={flashMode}
          ref={camera}
          onCameraReady={() => setCameraReady(true)}
        >
          <CloseButton onPress={() => navigation.navigate("Tabs")}>
            <Ionicons name="close" color="white" size={30} />
          </CloseButton>
        </Camera>
      ) : (
        <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
      )}
      {takenPhoto === "" ? (
        <Actions>
          <SliderContainer>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255, 255, 255, 1)"
              onValueChange={onZoomValueChange}
            />
          </SliderContainer>
          <ButtonsContainer>
            <TouchableOpacity onPress={onFlashChange}>
              <Ionicons size={30} color="white" name={getFlashIcon()} />
            </TouchableOpacity>
            <TakePhotoBtn onPress={takePhoto} />
            <TouchableOpacity onPress={onCameraSwitch}>
              <Ionicons size={30} color="white" name={"camera-reverse"} />
            </TouchableOpacity>
          </ButtonsContainer>
        </Actions>
      ) : (
        <PhotoActions>
          <PhotoAction onPress={onDissmiss}>
            <PhotoActionText>Dissmiss</PhotoActionText>
          </PhotoAction>
          <PhotoAction onPress={onUpload}>
            <PhotoActionText>Upload</PhotoActionText>
          </PhotoAction>
        </PhotoActions>
      )}
    </Container>
  );
}

export default TakePhoto;
