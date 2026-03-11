import CardIcon from '@/components/CardIcon';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function SelectTypeScreen() {
  const [selected, setSelected] = useState<'lost' | 'found' | null>(null);
  const router = useRouter();

  const handleNext = () => {
  if (!selected) return;

  if (selected === 'found') {
    router.push('/location'); 
    } else {
    router.push('/select-type'); 
    }
  };

  return (
    
    <View className="flex-1 bg-gray-100 px-8">
          <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
              <View className="w-1/3 h-1 bg-black" />
          </View>
      <View className="flex-1 bg-gray-100 justify-center">
        <Text className="text-[24px] font-pretendard-bold mb-10 px-4">
        반가워요!{"\n"}무엇을 위해 찾아오셨나요?
        </Text>

        <Pressable onPress={() => setSelected('lost')}>
          <CardIcon
            title="물건을 잃어버렸어요"
            description="지도에서 분실한 물건을 찾고 싶어요."
            selected={selected === 'lost'}
           
          />
        </Pressable>

        <Pressable onPress={() => setSelected('found')}>
          <CardIcon
            title="물건을 주웠어요"
            description="습득한 물건을 등록하고 싶어요."
            selected={selected === 'found'}
            
          />
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={!selected}
          className={`mt-8 mb-8 py-6 rounded-full items-center ${
            selected ? 'bg-black ' : ' bg-gray-300 '}`}
          style={[
            { boxShadow: selected ? '2px 2px 20px rgba(22, 26, 62, 0.2)' : '0px 2px 30px rgba(22, 26, 62, 0.05)' },
          ]}
        >
          <Text className="text-white text-[20px] font-pretendard-bold">
            다음으로
          </Text>
        </Pressable>
      </View>
    </View>
  );
}