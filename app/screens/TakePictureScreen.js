import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function TakePictureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [probability, setProbability] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermission();
  }, []);

  // 🧠 Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (image) {
        setImage(null); // Cancel the image preview
        setProbability(null);
        return true; // prevent default back behavior
      }
      return false; // allow default behavior if no image
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [image]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setImage(photo.uri);
      setProbability(null);
    }
  };

  const pickImage = async () => {
    setProbability(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // mock analysis
  const analyzeImage = async () => {
    if (!image) return;
    setIsLoading(true);
    setTimeout(() => {
      const randomProb = Math.floor(Math.random() * 100);
      setProbability(randomProb);
      setIsLoading(false);
    }, 1500);
  };

  const getColor = (prob) => {
    if (prob < 30) return "#4CAF50";
    if (prob < 60) return "#FFC107";
    return "#F44336";
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera permission to continue</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      {!image && (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      )}

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <View style={styles.bottomControls}>
        {!image && (
          <TouchableOpacity onPress={takePicture} style={styles.shutterBtn}>
            <Ionicons name="camera" size={36} color="#fff" />
          </TouchableOpacity>
        )}

        {!image && (
          <TouchableOpacity onPress={pickImage} style={styles.galleryBtn}>
            <Ionicons name="images-outline" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        {image && (
          <TouchableOpacity
            onPress={() => setImage(null)}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {image && (
        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Analyzing...</Text>
        </View>
      )}

      {probability !== null && (
        <View style={styles.result}>
          <Text style={[styles.resultText, { color: getColor(probability) }]}>
            Cancer probability: {probability}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "70%",
  },
  imagePreview: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  bottomControls: {
    position: "absolute",
    bottom: 90,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },
  shutterBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 50,
  },
  galleryBtn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 50,
    position: "absolute",
    right: 40,
  },
  backBtn: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 30,
  },
  analyzeBtn: {
    backgroundColor: "#34C759",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
    alignItems: "center",
  },
  result: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
