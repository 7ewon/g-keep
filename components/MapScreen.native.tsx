import ButtonBack from '@/components/ButtonBack';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import CardNoIcon from './CardNoIcon';

const CENTER = {
  latitude: 35.2285,
  longitude: 126.843,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type PhotoMarker = {
  id: string;
  coordinate: Coordinate;
  imageUri: string;
};

export default function MapScreenNative() {
  const router = useRouter();

  const [markers, setMarkers] = useState<PhotoMarker[]>([]);
  const [isPicking, setIsPicking] = useState(false);

  const openLibraryForCoordinate = async (coordinate: Coordinate) => {
    if (isPicking) return;

    setIsPicking(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('권한 필요', '사진 라이브러리 권한을 허용해주세요.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.45,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];

      const marker: PhotoMarker = {
        id: `${Date.now()}-${Math.random()}`,
        coordinate,
        imageUri: asset.uri,
      };

      setMarkers((prev) => [...prev, marker]);

      // 다음 페이지 이동
      router.push({
        pathname: '/tag',
        params: {
          uri: asset.uri,
          lat: coordinate.latitude,
          lng: coordinate.longitude,
        },
      });

    } finally {
      setIsPicking(false);
    }
  };

  const handleMapPress = (event: any) => {
    const coordinate = event?.nativeEvent?.coordinate;
    if (!coordinate) return;

    openLibraryForCoordinate(coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={CENTER}
        onPress={handleMapPress}
      >
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate}>
            <Callout>
              <View style={styles.callout}>
                <Image
                  source={{ uri: marker.imageUri }}
                  style={styles.calloutImage}
                />
                <Text>
                  {marker.coordinate.latitude.toFixed(5)},
                  {marker.coordinate.longitude.toFixed(5)}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
        <ButtonBack/>


      <View className="absolute bottom-16 right-8 left-8">
              <CardNoIcon
                title= '어디서 발견하셨나요?'
                description='분실물을 발견한 위치를 눌러주세요.'
              />    
        </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  hint: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  callout: {
    width: 160,
  },

  calloutImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
});
