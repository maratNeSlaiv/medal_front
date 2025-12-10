import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./app/core/theme";
import { AuthProvider } from "./app/core/AuthContext";
import RootNavigator from "./app/navigation/RootNavigator";

export default function App() {
  return (
    <Provider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}
