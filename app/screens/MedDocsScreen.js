import React, { useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ImageCard from "../components/ImageCard";
import { pickImages } from "../helpers/imagePicker";
import { analyzeImageText } from "../core/api";
import MealBuilderScreen from "./MealBuilderScreen";
import { useNavigation } from '@react-navigation/native';

export default function MedDocsScreen() {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState({});

  const addImages = async () => {
    const result = await pickImages();
    if (result) {
      setImages(prev => [...prev, ...result.assets]);
    }
  };

  const deleteImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setTexts(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setLoading(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleAnalyze = (index, imageUri) => {
    Alert.alert(
      "Analyze Text",
      "Do you want to analyze text in this image?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: async () => {
          setLoading(prev => ({ ...prev, [index]: true }));
          try {
            const text = await analyzeImageText(imageUri); // запрос к серверу
            setTexts(prev => ({ ...prev, [index]: text }));
          } catch (err) {
            Alert.alert("Error", "Failed to analyze text.");
          } finally {
            setLoading(prev => ({ ...prev, [index]: false }));
          }
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {images.map((img, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <ImageCard
              imageUri={img.uri}
              text={texts[index]}
              loading={loading[index]}
              onAnalyze={() => handleAnalyze(index, img.uri)}
              onEditText={() => console.log("Edit text", index)}
              onFavorite={() => console.log("Favorite", index)}
              onDelete={() => deleteImage(index)}
              onPress={() => console.log("Press image", index)}
            />
          </View>
        ))}
      </ScrollView>


      {/* Diet Builder button */}
      <TouchableOpacity
        style={[styles.addButton, { left: 24, right: "auto", backgroundColor: "#34C759" }]}
        onPress={() => navigation.navigate("MealBuilderScreen", { texts })}
      >
        <Ionicons name="restaurant-outline" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={addImages}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
