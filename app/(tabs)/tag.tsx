import ButtonBack from '@/components/ButtonBack';
import PrimaryButton from '@/components/ButtonPrimary';
import Tag from '@/components/Tag';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AVAILABLE_TAGS = ['휴대폰', '우산', '카드', '책', '가방', '지갑', '시계', '옷', '기타'];

export default function TagSelectionScreen() {
  const [selectedTag, setSelectedTag] = useState<string>('지갑');
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      router.replace('/');
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-100 px-8">

      <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
        <View className="w-2/3 h-1 bg-black" />
      </View>

      <ButtonBack />

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
            title="등록하기"
            onPress={handleNext}
          />
        </View>

      </View>

      {/* 🎉 모달 */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '700' }}>
              🎉 축하합니다!
            </Text>

            <Text style={{ marginTop: 10 }}>
              태그 등록이 완료되었습니다!
            </Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}