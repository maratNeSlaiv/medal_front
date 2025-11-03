import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data
const mockData = [
  {
    id: "1",
    date: "2025-10-12",
    image:
      "https://images.unsplash.com/photo-1600959907703-121d1ec43d59?auto=format&fit=crop&w=300&q=60",
    probability: 12,
  },
  {
    id: "2",
    date: "2025-10-20",
    image:
      "https://images.unsplash.com/photo-1612548402288-f9c64be6f6e5?auto=format&fit=crop&w=300&q=60",
    probability: 37,
  },
  {
    id: "3",
    date: "2025-11-01",
    image:
      "https://images.unsplash.com/photo-1576765608501-e287b89b7d7d?auto=format&fit=crop&w=300&q=60",
    probability: 72,
  },
];

function HistoryItem({ item }) {
  const color =
    item.probability < 30
      ? "#4CAF50"
      : item.probability < 60
        ? "#FFC107"
        : "#F44336";
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={[styles.prob, { color }]}>
          Cancer probability: {item.probability}%
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <Text style={styles.header}>Analysis History</Text>
        }
      />
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
    marginVertical: 30,
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
