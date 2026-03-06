import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

type CardIconProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
};

export default function CardIcon({
  title,
  description,
  icon,
  selected = false,
}: CardIconProps) {
  // 1. 애니메이션 값 초기화
  const animatedValue = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false,
      friction: 8, 
      tension: 40,
    }).start();
  }, [selected]);

  // 2. 부드러운 변화를 위한 스타일 보간
  const animatedStyle = {
    borderColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f3f4f6', '#000000'], 
    }),
    transform: [{ scale: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.01],
    })}]
  };

  return (
    <Animated.View
      style={[
        { borderWidth: 1, flexDirection: 'row', 
          alignItems: 'center', padding: 22, 
          paddingVertical: 30, borderRadius: 20, 
          marginBottom: 12, backgroundColor: '#FFFFFF',
          boxShadow: selected ? '2px 2px 30px rgba(22, 26, 62, 0.1)' : '0px 2px 30px rgba(22, 26, 62, 0.05)' },
        animatedStyle
      ]}
      className={`flex-row items-center px-12 py-14 rounded-2xl mb-2 bg-white ${
        selected ? 'drop-shadow-lg' : 'drop-shadow-md'
      }`}
    >
      <View className="flex-1">
        <Text className="text-[20px] font-pretendard-bold text-black">
          {title}
        </Text>
        <Text className="text-[16px] text-gray-400 mt-1 font-pretendard">
          {description}
        </Text>
      </View>
      
      <View className="ml-12">
        {icon}
      </View>
    </Animated.View>
  );
}


