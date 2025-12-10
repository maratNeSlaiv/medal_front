import React from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Text } from "react-native-paper";

import Background from "../components/Background";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

import { theme } from "../core/theme";

export default function MealDetailScreen({ navigation, route }) {
  const { title, imageUrl, ingredients, steps, time_minutes, servings, macros } = route.params;

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
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
});
