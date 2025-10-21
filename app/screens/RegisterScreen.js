import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Text } from "react-native";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { registerUser } from "../helpers/auth";
import { supabase } from "../helpers/supabaseClient";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  // 🔹 Обычная регистрация по email
  const onSignUpPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    const result = await registerUser(email.value, password.value);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Success",
        "Confirmation letter was sent to your email",
        [{ text: "OK", onPress: () => navigation.replace("LoginScreen") }]
      );
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // 🔹 Авторизация через Google (через Supabase SDK)
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "com.myapp://login-callback", // укажи deep link
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google Sign-in error:", error.message);
      Alert.alert("Error", "Unable to sign in with Google");
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome.</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={onSignUpPressed}
        loading={loading}
        style={{ marginTop: 24 }}
      >
        Next
      </Button>

      {/* ✅ Google Sign-In через Supabase */}
      <TouchableOpacity
        onPress={signInWithGoogle}
        style={styles.googleButton}
        activeOpacity={0.8}
      >
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>I already have an account!</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  googleButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: 230,
  },
  googleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
