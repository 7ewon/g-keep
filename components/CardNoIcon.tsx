import React from 'react';
import { Text, View } from 'react-native';

interface CardNoIconProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
}

export default function CardNoIcon({
  title,
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  children,
}: CardNoIconProps) {
  return (
    <View
      className={`
        bg-white 
        rounded-3xl 
        p-12
        py-14
        drop-shadow-md 
        ${className}
      `}
      style={[
            { boxShadow: '2px 2px 15px rgba(22, 26, 62, 0.05)' },
          ]}
    >
      <Text
        className={`
          text-[20px]
          font-pretendard-bold 
          text-black
          ${titleClassName}
        `}
      >
        {title}
      </Text>

      {description && (
        <Text
          className={`
            text-[16px] 
            font-pretendard
            text-gray-400
            mt-1
            ${descriptionClassName}
          `}
        >
          {description}
        </Text>
      )}

      {children && <View className="mt-4">{children}</View>}
    </View>
  );
}