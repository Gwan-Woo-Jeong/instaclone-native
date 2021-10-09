import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { UploadFormProps } from "../propTypes";
import DissmissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { gql, MutationUpdaterFn, useMutation } from "@apollo/client";
import { FEED_PHOTO } from "./fragments";
import {
  uploadPhoto,
  uploadPhotoVariables,
  uploadPhoto_uploadPhoto,
} from "./__generated__/uploadPhoto";
import { ReactNativeFile } from "apollo-upload-client";
import headerRight from "../components/nav/HeaderRight";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;
// 업로드 후에 캐시 업데이트 (피드에 필요한 내용 다 가져옴)

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 300px;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;

function UploadForm({ route, navigation }: UploadFormProps) {
  const updateUploadPhoto: MutationUpdaterFn<uploadPhoto> = (cache, result) => {
    const { uploadPhoto } = result.data!;
    // ROOT QUERY 모든 query의 모든 데이터가 들어감
    // cache - Photo:1, Comment:1, User:1 처럼 object가 들어감
    //  query 자체가 child니까 query를 수정
    //  기존 데이터에 새로 올린 uploadPhoto를 추가
    if (uploadPhoto?.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const { register, handleSubmit, setValue } = useForm();
  const [uploadPhotoMutation, { loading }] = useMutation<
    uploadPhoto,
    uploadPhotoVariables
  >(UPLOAD_PHOTO_MUTATION, { update: updateUploadPhoto });

  useEffect(() => {
    register("caption");
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: loading
        ? HeaderRightLoading
        : headerRight(handleSubmit(onValid)), // 로딩표시
      ...(loading && { headerLeft: () => null }), // 숨기기
    });
  }, [loading]); // 로딩 중일 때, next를 로딩중으로..

  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );

  //file - upload 타입이지만 프론트는 upload를 모름
  // $ npm i apollo-upload-client
  const onValid = ({ caption }: uploadPhoto_uploadPhoto) => {
    const file = new ReactNativeFile({
      // httpLink가 이 파일을 어떻게 다뤄야할지 모름
      // 파일 생성
      uri: route.params!.file,
      name: `1.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({ variables: { caption, file } });
  };

  // next나 done이나 똑같은 동작
  return (
    <DissmissKeyboard>
      <Container>
        <Photo resizeMode="contain" source={{ uri: route.params?.file }} />
        <CaptionContainer>
          <Caption
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onChangeText={(text) => setValue("caption", text)}
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onValid)}
          />
        </CaptionContainer>
      </Container>
    </DissmissKeyboard>
  );
}

export default UploadForm;
