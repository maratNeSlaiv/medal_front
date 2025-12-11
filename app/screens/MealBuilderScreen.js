import React, { useState, useEffect } from "react";
import { ScrollView, View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { fetchSummary, generateMeal } from "../core/api"; // импортируем готовые функции
import { Ionicons } from "@expo/vector-icons";

export default function MealBuilderScreen({ route }) {
  const { texts } = route.params;
  const navigation = useNavigation();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [dishName, setDishName] = useState("");
  const [mealLoading, setMealLoading] = useState(false);

  // Генерация summary для всех текстов
  useEffect(() => {
    const getSummary = async () => {
      setLoading(true);
      try {
        const response = await fetchSummary(texts);
        setSummary(response);
      } catch (err) {
        console.error(err);
        setSummary("Failed to generate summary.");
      } finally {
        setLoading(false);
      }
    };

    getSummary();
  }, [texts]);

  // Обработчик генерации блюда
  const handleGenerateMeal = async () => {
    if (!dishName.trim()) return;

    setMealLoading(true);
    try {
      const data = await generateMeal({ dish_name: dishName }); // вызываем функцию из api
      navigation.navigate("MealDetailScreen", {
        title: data.dish_name,
        imageUrl: data.image_url,
        ingredients: data.recipe.ingredients,
        steps: data.recipe.steps,
        time_minutes: data.recipe.time_minutes,
        servings: data.recipe.servings,
        macros: data.recipe.macros,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate meal.");
    } finally {
      setMealLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
          padding: 8,          // увеличиваем область нажатия
          backgroundColor: "rgba(255,255,255,0.5)", // чтобы визуально видеть кнопку
          borderRadius: 20,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // увеличиваем область клика
      >
        <Ionicons name="arrow-back" size={28} color="#007AFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 60 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Text style={styles.summary}>{summary}</Text>
        )}

        <View style={{ marginTop: 20 }}>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={dishName}
            onChangeText={setDishName}
          />
          <TouchableOpacity style={styles.button} onPress={handleGenerateMeal} disabled={mealLoading}>
            <Text style={styles.buttonText}>{mealLoading ? "Generating..." : "Generate Meal"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  summary: { fontSize: 16, lineHeight: 22 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: "#34C759", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
