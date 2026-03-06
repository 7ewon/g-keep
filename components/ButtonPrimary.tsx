import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
}: ButtonPrimaryProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        w-full 
        py-6
        rounded-full 
        items-center 
        justify-center 
        bg-black 
        drop-shadow-md
      
        active:opacity-80
        ${disabled ? 'opacity-40' : ''}
        ${className}
      `}
      style={[
            { boxShadow: '2px 2px 20px rgba(22, 26, 62, 0.2)' },
          ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`
            text-white 
            text-[20px]
            font-pretendard-bold
            ${textClassName}
          `}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}