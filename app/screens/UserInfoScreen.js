import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import countries from "world-countries";

import { AuthContext } from "../core/AuthContext";
import { clearTokens } from "../core/storage";

export default function UserInfoScreen() {
  const { logout } = useContext(AuthContext); // используем logout из контекста
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    nationality: "Bolivian",
    background: "Student in Biomedical Engineering",
    country: "Australia",
    genre: "Male",
  });

  const [tempUser, setTempUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setTempUser({ ...tempUser, [field]: value });
  };

  const handleSave = () => {
    setUser(tempUser);
    setIsEditing(false);
    Alert.alert(
      "Profile Updated",
      "Your information has been saved successfully.",
    );
  };

  const handleCancel = () => {
    setTempUser(user); // discard changes
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await clearTokens(); // удаляем access и refresh токены
    logout(); // переключаем authenticated = false → RootNavigator покажет StartScreen
  };

  const countryOptions = countries
    .map((c) => c.name.common)
    .sort((a, b) => a.localeCompare(b));

  const genreOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>User Information</Text>

        <View style={styles.form}>
          {/* Поля профиля */}
          <View style={styles.row}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={tempUser.firstName}
              onChangeText={(v) => handleChange("firstName", v)}
              editable={isEditing}
              placeholder="First Name"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={tempUser.lastName}
              onChangeText={(v) => handleChange("lastName", v)}
              editable={isEditing}
              placeholder="Last Name"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Country of Origin</Text>
            {isEditing ? (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={tempUser.country}
                  onValueChange={(v) => handleChange("country", v)}
                >
                  {countryOptions.map((country) => (
                    <Picker.Item label={country} value={country} key={country} />
                  ))}
                </Picker>
              </View>
            ) : (
              <TextInput
                style={[styles.input, styles.disabled]}
                value={tempUser.country}
                editable={false}
              />
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Genre</Text>
            {isEditing ? (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={tempUser.genre}
                  onValueChange={(v) => handleChange("genre", v)}
                >
                  {genreOptions.map((g) => (
                    <Picker.Item label={g} value={g} key={g} />
                  ))}
                </Picker>
              </View>
            ) : (
              <TextInput
                style={[styles.input, styles.disabled]}
                value={tempUser.genre}
                editable={false}
              />
            )}
          </View>
        </View>

        {/* Кнопки редактирования */}
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={22} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close-outline" size={22} color="#fff" />
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={22} color="#fff" />
              <Text style={styles.editButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Log out кнопка */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.editButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 80, paddingHorizontal: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "700", textAlign: "center", marginVertical: 30 },
  form: { backgroundColor: "#f8f8f8", borderRadius: 12, padding: 15, marginBottom: 30 },
  row: { marginBottom: 15 },
  label: { fontSize: 14, color: "#333", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 15 },
  disabled: { backgroundColor: "#eee", color: "#555" },
  pickerWrapper: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
  editButton: { backgroundColor: "#007AFF", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  cancelButton: { flex: 1, backgroundColor: "#FF3B30", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 10 },
  saveButton: { flex: 1, backgroundColor: "#34C759", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 10 },
  logoutButton: { backgroundColor: "#FF9500", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 10, marginTop: 20 },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 6 },
});
