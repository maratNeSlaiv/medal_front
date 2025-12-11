import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShowMoreText from "rn-show-more-text";

export default function ImageCard({
  imageUri,
  text,
  loading,
  onAnalyze,
  onEditText,
  onFavorite,
  onDelete,
  onPress
}) {
  return (
    <View style={styles.card}>
      {/* Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </TouchableOpacity>

      {/* Text block */}
      <View style={styles.textContainer}>
        {loading ? (
          <Text style={styles.text}>Analyzing...</Text>
        ) : (
          <ShowMoreText
            numberOfLines={3}              // сколько строк показываем по умолчанию
            readMoreText="Read more"
            readLessText="Show less"
            style={[styles.text, { color: text ? "#000" : "#999" }]}
          >
            {text || "Tap 🔍 to add text"}
          </ShowMoreText>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonColumn}>
        <TouchableOpacity style={styles.button} onPress={onFavorite}>
          <Ionicons name="star-outline" size={18} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAnalyze}>
          {loading ? <ActivityIndicator size="small" color="#000" /> : <Ionicons name="search-outline" size={18} color="#000" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", borderRadius: 12, overflow: "hidden", padding: 8 },
  imageContainer: { flex: 1 },
  image: { width: "100%", height: 150, borderRadius: 12 },
  textContainer: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "center", alignItems: "center", padding: 8, marginLeft: 8 },
  text: { textAlign: "center", fontSize: 16 },
  buttonColumn: { justifyContent: "space-between", height: 150, marginLeft: 8 },
  button: { width: 40, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center" },
});
