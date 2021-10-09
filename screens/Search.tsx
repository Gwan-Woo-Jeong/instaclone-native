import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ListRenderItem,
  useWindowDimensions,
  View,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { SearchProps } from "../propTypes";
import {
  searchPhotos,
  searchPhotosVariables,
  searchPhotos_searchPhotos,
} from "./__generated__/searchPhotos";

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  width: ${(props: { width: number }) => props.width / 1.5}px;
  color: black;
  padding: 5px 10px;
  border-radius: 7px;
`;

function Search({ navigation }: SearchProps) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, handleSubmit } = useForm();
  const [searchPhotos, { loading, data, called }] =
    useLazyQuery<searchPhotos>(SEARCH_PHOTOS);

  const onValid = ({ keyword }: searchPhotosVariables) => {
    searchPhotos({
      variables: {
        keyword,
      },
    });
  };

  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="rgba(0, 0, 0, 0.8)"
      placeholder="Search Photos"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      onChangeText={(text) => setValue("keyword", text)}
      autoCorrect={false}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
      headerTitleAlign: "center",
    });
    register("keyword", { required: true, minLength: 1 });
  }, []);

  const renderPhoto: ListRenderItem<searchPhotos_searchPhotos> = ({
    item: photo,
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Photo", { photoId: photo.id })}
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {loading && (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        )}
        {!called && (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        )}
        {data?.searchPhotos !== undefined &&
        data?.searchPhotos?.length === 0 ? (
          <MessageContainer>
            <MessageText>Could not find anything</MessageText>
          </MessageContainer>
        ) : (
          <FlatList
            numColumns={numColumns}
            data={data?.searchPhotos}
            keyExtractor={(photo) => "" + photo.id}
            renderItem={renderPhoto}
          />
        )}
      </View>
    </DismissKeyboard>
  );
}

export default Search;
