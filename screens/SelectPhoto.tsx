import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import {
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import { SelectPhotoProps } from "../propTypes";
import headerRight from "../components/nav/HeaderRight";

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
  background-color: black;
`;
const Bottom = styled.View`
  flex: 1;
  background-color: black;
`;

const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0;
`;

function SelectPhoto({ navigation }: SelectPhotoProps) {
  const [photos, setPhotos] = useState<Array<MediaLibrary.Asset>>([]);
  const [chosenPhoto, setChosenPhoto] = useState<string>("");
  useEffect(() => {
    if (Platform.OS === "ios") {
      getIosPermissions();
    } else {
      getAndroidPermissions();
    }
  }, []);

  // 사진을 선택할 때 마다, next 버튼 리렌더
  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight(() =>
        navigation.navigate("UploadForm", { file: chosenPhoto })
      ),
    });
  }, [chosenPhoto]);

  const numColumns = 4;
  const { width } = useWindowDimensions();

  const getIosPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && canAskAgain) {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();

      if (accessPrivileges !== "none") {
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      getPhotos();
    } else {
      getIosPermissions();
    }
  };

  const getAndroidPermissions = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    if (status === "undetermined" && canAskAgain) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "undetermined") {
        getPhotos();
      }
    } else if (status !== "undetermined") {
      getPhotos();
    } else {
      getAndroidPermissions();
    }
  };

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
  };
  const renderItem: ListRenderItem<MediaLibrary.Asset> = ({ item: photo }) => (
    <ImageContainer onPress={() => setChosenPhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / numColumns, height: 100 }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={photo.uri === chosenPhoto ? colors.blue : "white"}
        />
      </IconContainer>
    </ImageContainer>
  );

  return (
    <Container>
      <StatusBar hidden={false} />
      <Top>
        {chosenPhoto !== "" && (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width, height: "100%" }}
          />
        )}
      </Top>
      <Bottom>
        <FlatList
          numColumns={numColumns}
          data={photos}
          keyExtractor={(photo: MediaLibrary.Asset) => photo.id}
          renderItem={renderItem}
        />
      </Bottom>
    </Container>
  );
}

export default SelectPhoto;
