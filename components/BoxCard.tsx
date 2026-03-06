import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export default function BoxCard({ icon, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full aspect-square bg-white rounded-2xl items-center justify-center drop-shadow-md"
      style={[
            { boxShadow: '2px 2px 15px rgba(22, 26, 62, 0.05)' },
          ]}
    >
      <Feather name={icon} size={26} color="#333" />
      <Text className="mt-4 text-[20px] text-black font-pretendard">{label}</Text>
    </Pressable>
  );
}