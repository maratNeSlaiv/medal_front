import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HistoryScreen from "./HistoryScreen";
import TakePictureScreen from "./TakePictureScreen";
import UserInfoScreen from "./UserInfoScreen";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", borderTopWidth: 0.3 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "History") iconName = "time-outline";
          else if (route.name === "Take Picture") iconName = "camera-outline";
          else if (route.name === "User Info") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Take Picture" component={TakePictureScreen} />
      <Tab.Screen name="User Info" component={UserInfoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 20,
  },
});
