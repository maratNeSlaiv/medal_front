import React, { useState } from "react";
import { Alert } from "react-native";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

import { resetPassword } from "../core/api";

export default function ResetPasswordScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [oldPassword, setOldPassword] = useState({ value: "", error: "" });
  const [newPassword, setNewPassword] = useState({ value: "", error: "" });

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!username.value) {
      setUsername({ ...username, error: "Username is required" });
      return;
    }
    if (!oldPassword.value) {
      setOldPassword({ ...oldPassword, error: "Old password is required" });
      return;
    }
    if (!newPassword.value) {
      setNewPassword({ ...newPassword, error: "New password is required" });
      return;
    }

    setLoading(true);

    const response = await resetPassword(
      username.value,
      oldPassword.value,
      newPassword.value,
    );

    setLoading(false);

    if (response.message === "Password updated successfully") {
      Alert.alert("Success", "Your password has been updated.");
      navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Error", response.error || "Something went wrong");
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />

      <Header>Reset Password</Header>

      <TextInput
        label="Username"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
      />

      <TextInput
        label="Old Password"
        value={oldPassword.value}
        secureTextEntry
        onChangeText={(text) => setOldPassword({ value: text, error: "" })}
        error={!!oldPassword.error}
        errorText={oldPassword.error}
      />

      <TextInput
        label="New Password"
        value={newPassword.value}
        secureTextEntry
        onChangeText={(text) => setNewPassword({ value: text, error: "" })}
        error={!!newPassword.error}
        errorText={newPassword.error}
      />

      <Button
        mode="contained"
        onPress={onSubmit}
        style={{ marginTop: 16 }}
        loading={loading}
      >
        Update Password
      </Button>
    </Background>
  );
}
