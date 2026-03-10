import ButtonBack from '@/components/ButtonBack';
import PrimaryButton from '@/components/ButtonPrimary';
import Tag from '@/components/Tag';
import { uploadLostItem } from '@/services/lostItemService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, Text, View } from 'react-native';

const AVAILABLE_TAGS = ['휴대폰', '우산', '카드', '책', '가방', '지갑', '시계', '옷', '기타'];

const getSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function TagSelectionScreen() {
  const [selectedTag, setSelectedTag] = useState<string>('지갑');
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams<{
    uri?: string | string[];
    lat?: string | string[];
    lng?: string | string[];
  }>();

  const imageUri = getSingleParam(params.uri);
  const latitude = Number(getSingleParam(params.lat));
  const longitude = Number(getSingleParam(params.lng));

  const hasLocation = useMemo(
    () => Number.isFinite(latitude) && Number.isFinite(longitude),
    [latitude, longitude],
  );

  const handleNext = async () => {
    if (!imageUri || !hasLocation) {
      Alert.alert('업로드 정보가 없습니다', '지도에서 위치를 선택하고 사진을 다시 등록해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadLostItem({
        imageUri,
        latitude,
        longitude,
        tag: selectedTag,
      });

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/');
      }, 1800);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('등록 실패', errorMessage);
    } finally {
      setIsUploading(false);
    }
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
            source={{
              uri:
                imageUri || 'https://images.unsplash.com/photo-1574051033756-3a541013115a',
            }}
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
            title={isUploading ? '업로드 중...' : '등록하기'}
            onPress={handleNext}
            loading={isUploading}
            disabled={!imageUri || !hasLocation}
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
            <Text style={{ fontSize: 20, fontFamily: 'Pretendard-Bold' }}>
              🎉 축하합니다!
            </Text>

            <Text style={{ fontSize: 16, marginTop: 10, fontFamily: 'Pretendard-regular' }}>
              태그와 위치 등록이 완료되었습니다!
            </Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}
