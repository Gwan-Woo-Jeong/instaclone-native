import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { InputText } from "../components/auth/AuthShared";
import Avatar from "../components/Avatar";
import useMe from "../hooks/useMe";
import { EditProfileProps } from "../propTypes";
import { Ionicons } from "@expo/vector-icons";

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

const Container = styled.View`
  background-color: black;
  flex: 1;
`;

const AvatarContainer = styled.View`
  align-items: center;
  margin: 15px 0 12px 0;
`;

const TouchableContainer = styled.TouchableOpacity`
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

const IconContainer = styled.View`
  background-color: #e0e0e0;
  height: 50px;
  width: 50px;
  border-radius: 1000px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 5px;
`;

function EditProfile({ route, navigation }: EditProfileProps) {
  const { data } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<EditProfileForm>({
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

  const onValid = () => {
    console.log("Edit!");
  };

  useEffect(() => {
    register("bio", { required: true });
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  const selectedPhoto = route.params?.file || data?.me?.avatar;

  const [editProfileMutation, { loading }] = useMutation(EDIT_PROFILE_MUTATION);

  return (
    <Container>
      <AvatarContainer>
        <TouchableContainer
          onPress={() =>
            navigation.navigate("SelectPhoto", {
              editMode: true,
              password: route.params?.password,
            })
          }
        >
          <Avatar uri={selectedPhoto!} size={180} />
          <IconContainer>
            <Ionicons name="camera-sharp" size={30} color="black" />
          </IconContainer>
        </TouchableContainer>
      </AvatarContainer>
      <AuthLayout editMode={true}>
        <InputTitle>Bio</InputTitle>
        <EditTextInput
          autoFocus
          ref={bioRef}
          placeholder="Bio"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onChangeText={(text) => setValue("bio", text)}
          value={watch("bio")}
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
        />
        <InputTitle>Last Name</InputTitle>
        <EditTextInput
          ref={lastNameRef}
          placeholder="Last Name"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          onChangeText={(text) => setValue("lastName", text)}
          value={watch("lastName")}
        />
        <InputTitle>User Name</InputTitle>
        <EditTextInput
          ref={userNameRef}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={(text) => setValue("username", text)}
          editable={false}
          selectTextOnFocus={false}
          value={watch("username")}
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
        />
        <AuthButton
          text="Edit Profile"
          disabled={false}
          onPress={handleSubmit(onValid)}
        />
      </AuthLayout>
    </Container>
  );
}

export default EditProfile;
