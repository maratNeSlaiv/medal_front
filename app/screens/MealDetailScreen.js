import React from "react";
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import Background from "../components/Background";
import Header from "../components/Header";

import { theme } from "../core/theme";

export default function MealDetailScreen({ navigation, route }) {
  const { title, imageUrl, ingredients, steps, time_minutes, servings, macros } = route.params;

  return (
    <Background>
      {/* Кнопка закрытия (крестик) */}
      <TouchableOpacity
        style={[styles.closeButton, { padding: 8 }]} // увеличиваем область нажатия
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // дополнительная зона клика
      >
        <Ionicons name="close-outline" size={32} color="#007AFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.image} source={{ uri: imageUrl }} />

        <Header>{title}</Header>

        <View style={styles.metaContainer}>
          {time_minutes && <Text style={styles.metaText}>⏱ Time: {time_minutes} min</Text>}
          {servings && <Text style={styles.metaText}>🍽 Servings: {servings}</Text>}
        </View>

        {macros && (
          <View style={styles.macrosBox}>
            <Text style={styles.macrosTitle}>Macros (per serving)</Text>
            <Text style={styles.macrosText}>Protein: {macros.protein}g</Text>
            <Text style={styles.macrosText}>Carbs: {macros.carbs}g</Text>
            <Text style={styles.macrosText}>Fats: {macros.fats}g</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {steps.map((step, index) => (
            <Text key={index} style={styles.listItem}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingTop: 60, // чтобы крестик не перекрывал контент
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#555",
  },
  macrosBox: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  macrosTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  macrosText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
});
