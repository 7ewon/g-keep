import CardNoIcon from '@/components/CardNoIcon'; // 아까 그 컴포넌트
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function MapPreviewScreen() {
  const router = useRouter();


  return (
    <View className="flex-1 px-8">
      <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
          <View className="w-3/3 h-1 bg-black" />
      </View>
      <View className="absolute bottom-28 left-8 right-8">
        <CardNoIcon
          title="' 카드 ' 분실물 발견!"
          description="분실물이 13개 발견되었어요."
        />
      </View>
    </View>
  );
}