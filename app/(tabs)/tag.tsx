import ButtonBack from '@/components/ButtonBack';
import PrimaryButton from '@/components/ButtonPrimary';
import Tag from '@/components/Tag';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AVAILABLE_TAGS = ['휴대폰', '우산', '카드', '책', '가방', '지갑', '시계', '옷', '기타'];

export default function TagSelectionScreen() {
  const [selectedTag, setSelectedTag] = useState<string>('지갑');
  
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    console.log(`${selectedTag} 선택됨`);
  };

  return (
    <View 
      className="flex-1 bg-gray-100 px-8" 
    >
       <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
              <View className="w-2/3 h-1 bg-black" />
          </View>
          <ButtonBack/> 
      <View className="flex-1 justify-center">
        
        <Text className="text-[24px] font-pretendard-bold px-4">
          분실물의 태그를{"\n"}등록해주세요.
        </Text>

        <View className="relative w-full aspect-[8/7] rounded-3xl overflow-hidden my-8 bg-gray-200">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1574051033756-3a541013115a' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row flex-wrap justify-center gap-x-2 gap-y-2">
          {AVAILABLE_TAGS.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              selected={selectedTag === tag}
              onPress={() => setSelectedTag(tag)}
            />
          ))}
        </View>

        <View className="mt-10 mb-6">
          <PrimaryButton 
            title="다음으로" 
            onPress={handleNext} 
          />
        </View>

      </View>
    </View>
  );
}