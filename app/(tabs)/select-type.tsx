import BoxCard from "@/components/BoxCard";
import ButtonBack from "@/components/ButtonBack";
import ButtonPrimary from "@/components/ButtonPrimary";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";

type Tag =
  | "phone"
  | "umbrella"
  | "card"
  | "book"
  | "bag"
  | "wallet"
  | "watch"
  | "clothes"
  | "more";

export default function LostItemPage() {
  const router = useRouter();

  const items = [
    { image: require('@/assets/images/phone.png'), label: "휴대폰" },
    { image: require('@/assets/images/umbrella.png'), label: "우산" },
    { image: require('@/assets/images/card.png'), label: "카드" },
    { image: require('@/assets/images/book.png'), label: "책" },
    { image: require('@/assets/images/bag.png'), label: "가방" },
    { image: require('@/assets/images/wallet.png'), label: "지갑" },
    { image: require('@/assets/images/watch.png'), label: "시계" },
    { image: require('@/assets/images/clothes.png'), label: "옷" },
    { image: require('@/assets/images/more.png'), label: "기타" },
  ];

  const handleSelect = (tag: Tag) => {
    router.push({
      pathname: "/map",
      params: { tag },
    });
  };

  return (
    <View className="flex-1 bg-gray-100">

      <Image
      source={require('@/assets/images/map-image.png')}
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 280,
      }}
    />

    <Image
      source={require('@/assets/images/gradient.png')}
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 280,
      }}
    />
      <View className="px-8 flex-1">
        <View className="w-full h-1 bg-gray-200 mt-20 overflow-hidden">
          <View className="w-2/3 h-1 bg-black" />
        </View>

        <ButtonBack />

        <View className="flex-1 justify-center">
          <Text className="text-[24px] font-pretendard-bold mb-8 px-4">
            잃어버린 물건이 무엇인가요?
          </Text>

          <View className="flex-row flex-wrap">
            {items.map((item, index) => (
              <View key={index} className="w-1/3 p-2">
                <BoxCard
                  image={item.image}
                  label={item.label}
                  onPress={() => handleSelect(item.label as Tag)}
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
              })
            }
          />
        </View>
      </View>

    </View>
  );
}