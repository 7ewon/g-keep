import React, { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

type TagProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Pressable을 Animated 컴포넌트로 만듭니다.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Tag({ label, selected, onPress }: TagProps) {
  // 1. 애니메이션 값 초기화 (0: 미선택, 1: 선택)
  const animatedValue = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false, // 배경색 애니메이션을 위해 false 유지
      friction: 8,
      tension: 40,
    }).start();
  }, [selected]);

  // 2. 스타일 보간 (Interpolation)
  const animatedStyle = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff', '#000000'],
    }),
    borderColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e5e7eb', '#000000'], 
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.01],
        }),
      },
    ],
  };

  const textStyle = {
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000000', '#ffffff'], 
    }),
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        animatedStyle,
        {
          paddingHorizontal: 30,
          paddingVertical: 14,
          borderRadius: 9999,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '2px 2px 15px rgba(22, 26, 62, 0.05)'
        }
      ]}
      // 그림자 효과는 Tailwind(NativeWind) 클래스로 유지
      className={`${selected ? 'drop-shadow-md' : ''}`}
    >
      <Animated.Text
        style={textStyle}
        className="text-[20px] font-pretendard"
      >
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
}