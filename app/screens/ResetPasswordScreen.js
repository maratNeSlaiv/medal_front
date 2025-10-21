import React, { useState } from "react";
import { Alert } from "react-native";
import email from "react-native-email-link";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import { forgotPassword } from "../helpers/auth";

export default function ResetPasswordScreen({ navigation }) {
  const [emailInput, setEmailInput] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(emailInput.value);
    if (emailError) {
      setEmailInput({ ...emailInput, error: emailError });
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(emailInput.value);

      if (response.success) {
        // Попытка открыть почтовое приложение
        email({ to: emailInput.value }).catch(() => {
          Alert.alert(
            "Email App Not Found",
            "Не удалось открыть почтовое приложение. Проверьте настройки или откройте почту вручную."
          );
        });

        // Можно сразу переходить на экран логина
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Error", response.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset your password.</Header>
      <TextInput
        label="Email"
        returnKeyType="done"
        value={emailInput.value}
        onChangeText={(text) => setEmailInput({ value: text, error: "" })}
        error={!!emailInput.error}
        errorText={emailInput.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive an email with the reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
        loading={loading}
      >
        Continue
      </Button>
    </Background>
  );
}
