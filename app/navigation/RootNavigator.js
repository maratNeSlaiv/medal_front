import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../core/AuthContext";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
  MedDocsScreen,
} from "../screens";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { authenticated } = useContext(AuthContext);

  if (authenticated === null) return null; // можно сплэш показать

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authenticated ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="MedDocsScreen" component={MedDocsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
