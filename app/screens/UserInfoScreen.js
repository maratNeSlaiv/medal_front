import React, { useState } from "react";
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

export default function UserInfoScreen() {
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    nationality: "Bolivian",
    background: "Student in Biomedical Engineering",
    country: "Australia",
    genre: "Male",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert(
      "Profile Updated",
      "Your information has been saved successfully.",
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>User Information</Text>

        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={user.firstName}
              onChangeText={(v) => handleChange("firstName", v)}
              editable={isEditing}
              placeholder="First Name"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={user.lastName}
              onChangeText={(v) => handleChange("lastName", v)}
              editable={isEditing}
              placeholder="Last Name"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Nationality</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={user.nationality}
              onChangeText={(v) => handleChange("nationality", v)}
              editable={isEditing}
              placeholder="Nationality"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Country of Residence</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={user.country}
              onChangeText={(v) => handleChange("country", v)}
              editable={isEditing}
              placeholder="Country of Residence"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabled]}
              value={user.genre}
              onChangeText={(v) => handleChange("genre", v)}
              editable={isEditing}
              placeholder="Genre"
            />
          </View>
        </View>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={22} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={22} color="#fff" />
            <Text style={styles.editButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 30,
  },
  form: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  disabled: {
    backgroundColor: "#eee",
    color: "#555",
  },
  editButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
  },
});
