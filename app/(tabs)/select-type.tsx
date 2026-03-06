import BoxCard from "@/components/BoxCard";
import ButtonPrimary from "@/components/ButtonPrimary";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

type Tag =
  | "smartphone"
  | "credit-card"
  | "headphones"
  | "watch"
  | "book"
  | "shopping-bag"
  | "key"
  | "camera"
  | "more-horizontal";

export default function LostItemPage() {
  const router = useRouter();

  const items: { icon: Tag; label: string }[] = [
    { icon: "smartphone", label: "휴대폰" },
    { icon: "credit-card", label: "지갑" },
    { icon: "headphones", label: "이어폰" },
    { icon: "watch", label: "시계" },
    { icon: "book", label: "책" },
    { icon: "shopping-bag", label: "가방" },
    { icon: "key", label: "열쇠" },
    { icon: "camera", label: "카메라" },
    { icon: "more-horizontal", label: "기타" },
  ];

  const handleSelect = (tag: Tag) => {
    router.push({
      pathname: "/map",
      params: { tag },
    });
  };

  return (
    <View className="flex-1 bg-gray-100 px-8">
      <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
              <View className="w-2/3 h-1 bg-black" />
          </View>
      <View className="flex-1 justify-center">
        <Text className="text-[24px] font-pretendard-bold mb-8 px-4">
          잃어버린 물건이 무엇인가요?
        </Text>

        <View className="flex-row flex-wrap">
          {items.map((item, index) => (
            <View key={index} className="w-1/3 p-2">
              <BoxCard
                icon={item.icon}
                label={item.label}
                onPress={() => handleSelect(item.icon)} 
              />
            </View>
          ))}
      </View>

      <Text className="text-center text-[20px] font-pretendard text-gray-400 my-12">
        또는?
      </Text>

      <ButtonPrimary
        title="지도에서 전체 보기"
        onPress={() =>
          router.push({
            pathname: "/map",
            params: { tag: "all" },
          })
        }
      />
      </View>
    </View>
  );
}