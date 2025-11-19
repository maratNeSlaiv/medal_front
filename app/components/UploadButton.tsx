import React from "react";
import { TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";

export function UploadButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Plus size={32} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}
