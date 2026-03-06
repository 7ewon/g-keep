import React from "react";
import { Image, Pressable, Text } from "react-native";

type Props = {
  image: any;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export default function BoxCard({ image, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full aspect-square bg-white rounded-2xl items-center justify-center drop-shadow-md"
      style={[
            { boxShadow: '2px 2px 15px rgba(22, 26, 62, 0.05)' },
          ]}
    >
      <Image
        source={ image }
        style={{ width: 54, height: 54, objectFit: 'contain' }}
      />
      <Text className="mt-2 text-[18px] text-black font-pretendard">{label}</Text>
    </Pressable>
  );
}