import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, TextInput } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText } from "../components/auth/AuthShared";
import Avatar from "../components/Avatar";
import useMe from "../hooks/useMe";
import { EditProfileProps } from "../propTypes";
import { Ionicons } from "@expo/vector-icons";
import { editProfile } from "./__generated__/editProfile";
import { ReactNativeFile } from "extract-files";

interface EditProfileForm {
  bio: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
    $bio: String!
    $avatar: Upload!
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

const AvatarContainer = styled.View`
  align-items: center;
  margin: 15px 0 12px 0;
  position: relative;
`;

const EditTextInput = styled(InputText)`
  padding: 10px;
  font-size: 12px;
  margin-bottom: ${(props) => (props.lastOne ? "10" : "13")}px;
`;

const InputTitle = styled.Text`
  color: white;
  margin: 0px 0px 5px 7px;
  font-weight: 600;
  font-size: 12px;
`;

const IconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 1000px;
`;

const CameraIcon = styled(IconContainer)`
  background-color: #dfdfdf;
  height: 50px;
  width: 50px;
  bottom: 0;
  right: 70px;
`;

const TrashIcon = styled(IconContainer)`
  background-color: #6e6e6e;
  height: 25px;
  width: 25px;
  left: 75px;
  top: 18px;
`;

function EditProfile({ route, navigation }: EditProfileProps) {
  const { data } = useMe();
  const { register, handleSubmit, setValue, watch } = useForm<EditProfileForm>({
    defaultValues: {
      firstName: data?.me?.firstName,
      lastName: data?.me?.lastName || "",
      username: data?.me?.username,
      email: data?.me?.email,
      password: route.params?.password,
      bio: data?.me?.bio || "",
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Profile",
      headerTitleAlign: "center",
    });
  }, []);

  const bioRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    register("bio", { required: true });
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  const selectedPhoto = route.params?.file;

  useEffect(() => {
    if (selectedPhoto) {
      setavatarPhoto(selectedPhoto);
      setUploadPhoto(selectedPhoto);
    } else {
      setavatarPhoto(data?.me?.avatar!);
      setUploadPhoto("existing");
    }
  }, [selectedPhoto]);

  const [avatarPhoto, setavatarPhoto] = useState<string | null>(null);
  const [uploadPhoto, setUploadPhoto] = useState<string>("existing");

  const resetAvatar = () => {
    setavatarPhoto(null);
    setUploadPhoto("default");
  };

  const onCompleted = (data: editProfile) => {
    if (data.editProfile.error) {
      alert(data.editProfile.error);
    } else {
      navigation.navigate("Me");
      alert("Profile edited successfully");
    }
  };

  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    { onCompleted }
  );

  const onValid: SubmitHandler<editProfile> = (data) => {
    if (!loading) {
      let file;
      if (uploadPhoto === "existing" || uploadPhoto === "default") {
        file = uploadPhoto;
      } else {
        file = new ReactNativeFile({
          uri: uploadPhoto,
          name: `1.jpg`,
          type: "image/jpeg",
        });
      }
      editProfileMutation({
        variables: {
          ...data,
          avatar: file,
        },
      });
    }
  };

  return (
    <AuthLayout editMode={true}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={50}>
        <AvatarContainer>
          <Avatar uri={avatarPhoto!} size={180} />
          {avatarPhoto && (
            <TrashIcon onPress={resetAvatar}>
              <Ionicons name="trash" size={17} color="#dbdada" />
            </TrashIcon>
          )}
          <CameraIcon
            onPress={() =>
              navigation.navigate("SelectPhoto", {
                editMode: true,
                password: route.params?.password,
              })
            }
          >
            <Ionicons name="camera-sharp" size={30} color="#222222" />
          </CameraIcon>
        </AvatarContainer>
        <InputTitle>Bio</InputTitle>
        <EditTextInput
          autoFocus
          ref={bioRef}
          placeholder="Bio"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onChangeText={(text) => setValue("bio", text)}
          value={watch("bio")}
          autoCorrect={false}
        />
        <InputTitle>First Name</InputTitle>
        <EditTextInput
          autoFocus
          ref={firstNameRef}
          placeholder="First Name"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onChangeText={(text) => setValue("firstName", text)}
          value={watch("firstName")}
          autoCorrect={false}
        />
        <InputTitle>Last Name</InputTitle>
        <EditTextInput
          ref={lastNameRef}
          placeholder="Last Name"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onChangeText={(text) => setValue("lastName", text)}
          value={watch("lastName")}
          autoCorrect={false}
        />
        <InputTitle>User Name</InputTitle>
        <EditTextInput
          ref={userNameRef}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={(text) => setValue("username", text)}
          selectTextOnFocus={false}
          value={watch("username")}
          autoCorrect={false}
        />
        <InputTitle>Email</InputTitle>
        <EditTextInput
          ref={emailRef}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={(text) => setValue("email", text)}
          value={watch("email")}
          autoCorrect={false}
        />
        <InputTitle>Password</InputTitle>
        <EditTextInput
          ref={passwordRef}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="done"
          secureTextEntry
          lastOne={true}
          onChangeText={(text) => setValue("password", text)}
          value={watch("password")}
          autoCorrect={false}
        />
        <AuthButton
          disabled={false}
          text="Edit Profile"
          onPress={handleSubmit(onValid)}
        />
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

export default EditProfile;
