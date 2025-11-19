import { Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { FormItem, FormList } from "../components/Form";
import { UploadButton } from "../components/UploadButton";
import * as Colors from "@bacons/apple-colors";
import { pickImages } from "../helpers/imagePicker";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  const [results, setResults] = useState(null);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [texts, setTexts] = useState({});

  const pickImagesWithResults = async () => {
    const result = await pickImages();
    if (result) {
      setResults(result.serverResponse);
      setImages(prev => [...prev, ...result.assets]);
    }
  };

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Upload Button */}
      <FormList>
        <FormItem>
          <UploadButton onPress={pickImagesWithResults} />
        </FormItem>
      </FormList>

      {/* Images */}
      {images.length > 0 && (
        <View style={{ gap: 12 }}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setFullscreenImage(img.uri)}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} resizeMode="cover" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textContainer}
                onPress={() =>
                  Alert.prompt(
                    "Enter Text",
                    "Write something for this image",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "OK",
                        onPress: (value) => setTexts(prev => ({ ...prev, [index]: value || "" })),
                      },
                    ],
                    "plain-text",
                    texts[index] || ""
                  )
                }
              >
                <Text style={styles.textInside}>{texts[index] || "Tap 🔍 to add text"}</Text>
              </TouchableOpacity>

              <View style={styles.buttonColumn}>
                <TouchableOpacity style={styles.buttonSquare}>
                  <Text style={styles.buttonSymbol}>☆</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSquare}
                  onPress={() =>
                    Alert.prompt(
                      "Enter Text",
                      "Write something for this image",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "OK",
                          onPress: (value) => setTexts(prev => ({ ...prev, [index]: value || "" })),
                        },
                      ],
                      "plain-text",
                      texts[index] || ""
                    )
                  }
                >
                  <Text style={styles.buttonSymbol}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSquare}
                  onPress={() =>
                    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          setImages(prev => prev.filter((_, i) => i !== index));
                          setTexts(prev => {
                            const copy = { ...prev };
                            delete copy[index];
                            return copy;
                          });
                        },
                      },
                    ])
                  }
                >
                  <Text style={styles.buttonSymbol}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Results */}
      <FormList>
        <FormItem>
          <View style={{ gap: 4 }}>
            <Text style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}>Results</Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
              {results ? JSON.stringify(results, null, 2) : "No results yet"}
            </Text>
          </View>
        </FormItem>
      </FormList>

      {/* Navigation Button (пример) */}
      <FormList>
        <FormItem>
          <TouchableOpacity
            style={{ padding: 12, backgroundColor: "#eee", borderRadius: 8 }}
            onPress={() => navigation.navigate("StartScreen")}
          >
            <Text>Go to StartScreen</Text>
          </TouchableOpacity>
        </FormItem>
      </FormList>

      {/* Fullscreen Modal */}
      <Modal visible={!!fullscreenImage} transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
        <TouchableOpacity style={styles.fullscreenContainer} onPress={() => setFullscreenImage(null)}>
          <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageRow: { flexDirection: "row", gap: 12, alignItems: "center", height: 150, width: "100%" },
  previewImage: { flex: 1, height: "100%", borderRadius: 12 },
  buttonColumn: { justifyContent: "space-between", height: "100%", marginLeft: "auto" },
  buttonSquare: { width: 40, height: 40, backgroundColor: "#f2f2f2", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  buttonSymbol: { fontSize: 18 },
  fullscreenContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  fullscreenImage: { width: "100%", height: "100%" },
  textContainer: { flex: 1, height: 150, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
  textInside: { color: "#333", fontSize: 16, textAlign: "center" },
});
