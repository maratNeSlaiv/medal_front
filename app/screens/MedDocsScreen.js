import React, { useEffect, useState } from "react";
import { ScrollView, View, Image, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet } from "react-native";
import Background from "../components/Background";
import Header from "../components/Header";
import Button from "../components/Button";
import { Text } from "react-native-paper";
import { FormItem, FormList } from "../components/Form";
import { UploadButton } from "../components/UploadButton";
import * as Colors from "@bacons/apple-colors";
import { pickImages } from "../helpers/imagePicker";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function MedDocsScreen({ navigation }) {
  const [results, setResults] = useState(null);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [texts, setTexts] = useState({});
  const [textModal, setTextModal] = useState({ visible: false, index: null, value: "" });

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  const pickImagesWithResults = async () => {
    const result = await pickImages();
    if (result) {
      setResults(result.serverResponse);
      setImages(prev => [...prev, ...result.assets]);
    }
  };

  const openTextModal = (index) => {
    setTextModal({ visible: true, index, value: texts[index] || "" });
  };

  const saveText = () => {
    setTexts(prev => ({ ...prev, [textModal.index]: textModal.value }));
    setTextModal({ visible: false, index: null, value: "" });
  };

  const onDeleteImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setTexts(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageRow}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => setFullscreenImage(item.uri)}>
        <Image source={{ uri: item.uri }} style={styles.previewImage} resizeMode="cover" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.textContainer} onPress={() => openTextModal(index)}>
        <Text style={styles.textInside}>{texts[index] || "Tap 🔍 to add text"}</Text>
      </TouchableOpacity>

      <View style={styles.buttonColumn}>
        <Button mode="outlined" onPress={() => {}} style={styles.smallButton}>☆</Button>
        <Button mode="outlined" onPress={() => openTextModal(index)} style={styles.smallButton}>🔍</Button>
        <Button mode="outlined" onPress={() => onDeleteImage(index)} style={styles.smallButton}>🗑️</Button>
      </View>
    </View>
  );

  return (
    <Background>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header>Medical Documents</Header>

        <FormList>
          <FormItem>
            <UploadButton onPress={pickImagesWithResults} />
          </FormItem>
        </FormList>

        {images.length > 0 && (
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImageItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}

        <FormList>
          <FormItem>
            <View style={{ gap: 4 }}>
              <Text style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}>Results</Text>
              <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
                {results ? JSON.stringify(results, null, 2).slice(0, 1000) + (JSON.stringify(results).length > 1000 ? "..." : "") : "No results yet"}
              </Text>
            </View>
          </FormItem>
        </FormList>

        <Button mode="contained" onPress={() => navigation.navigate("StartScreen")}>
          Go to StartScreen
        </Button>

        {/* Fullscreen Modal */}
        <Modal visible={!!fullscreenImage} transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
          <TouchableOpacity style={styles.fullscreenContainer} onPress={() => setFullscreenImage(null)}>
            <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} resizeMode="contain" />
          </TouchableOpacity>
        </Modal>

        {/* Text Input Modal */}
        <Modal visible={textModal.visible} transparent animationType="fade" onRequestClose={() => setTextModal({ visible: false, index: null, value: "" })}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.modalInput}
                value={textModal.value}
                onChangeText={text => setTextModal(prev => ({ ...prev, value: text }))}
                placeholder="Enter text for this image"
                multiline
              />
              <Button mode="contained" onPress={saveText}>Save</Button>
              <Button mode="outlined" onPress={() => setTextModal({ visible: false, index: null, value: "" })}>Cancel</Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  imageRow: { flexDirection: "row", alignItems: "center", height: 150, width: "100%" },
  previewImage: { flex: 1, height: "100%", borderRadius: 12 },
  buttonColumn: { justifyContent: "space-between", height: "100%", marginLeft: 8 },
  smallButton: { width: 40, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  fullscreenContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  fullscreenImage: { width: "100%", height: "100%" },
  textContainer: { flex: 1, height: 150, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
  textInside: { color: "#333", fontSize: 16, textAlign: "center" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", padding: 16, borderRadius: 12, width: "80%" },
  modalInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 12, minHeight: 80, textAlignVertical: "top" },
});
