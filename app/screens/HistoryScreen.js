import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { predictMole } from "../core/api"; // твой API-файл

export default function HistoryScreen() {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("Permission to access gallery is required.");

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.cancelled) {
      setLoading(true);
      try {
        const prediction = await predictMole(result.uri);
        setCurrentImage({
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          image: result.uri,
          probability: prediction.probability, // предполагаем, что API возвращает { probability: number }
        });
      } catch (err) {
        alert("Failed to analyze mole.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderImage = () => {
    if (!currentImage) return null;

    const color =
      currentImage.probability < 30
        ? "#4CAF50"
        : currentImage.probability < 60
        ? "#FFC107"
        : "#F44336";

    return (
      <View style={styles.card}>
        <Image source={{ uri: currentImage.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.date}>{currentImage.date}</Text>
          <Text style={[styles.prob, { color }]}>
            Cancer probability: {currentImage.probability}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Analysis</Text>
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />}

      {renderImage()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    marginHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 220,
  },
  info: {
    padding: 15,
    alignItems: "flex-start",
  },
  date: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  prob: {
    fontSize: 16,
    fontWeight: "600",
  },
});
