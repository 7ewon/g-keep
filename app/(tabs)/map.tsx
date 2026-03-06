import ButtonBack from '@/components/ButtonBack';
import CardNoIcon from '@/components/CardNoIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

const CENTER = {
  latitude: 35.2285,
  longitude: 126.843,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type PhotoMarker = {
  id: string;
  coordinate: Coordinate;
  imageUri: string;
  tag: string;
};

const DATA: PhotoMarker[] = [
  {
    id: '1',
    coordinate: { latitude: 35.2285, longitude: 126.843 },
    imageUri: 'https://picsum.photos/200',
    tag: '책',
  },
  {
    id: '2',
    coordinate: { latitude: 35.229, longitude: 126.845 },
    imageUri: 'https://picsum.photos/201',
    tag: '책',
  },
  {
    id: '3',
    coordinate: { latitude: 35.227, longitude: 126.842 },
    imageUri: 'https://picsum.photos/202',
    tag: '책',
  },
];

export default function TagMapScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();

  const filteredMarkers = useMemo(() => {
    if (!tag) return DATA;
    return DATA.filter((item) => item.tag === tag);
  }, [tag]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={CENTER}>
        {filteredMarkers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate}>
            
            <View style={styles.marker}>
              <Image
                source={{ uri: marker.imageUri }}
                style={styles.markerImage}
              />
            </View>

            <Callout tooltip>
              <View style={styles.calloutCard}>
                <Image
                  source={{ uri: marker.imageUri }}
                  style={styles.calloutImage}
                />
              </View>
            </Callout>

          </Marker>
        ))}
      </MapView>

      <ButtonBack />

      <View className="absolute bottom-16 right-8 left-8">
        <CardNoIcon
          title={tag || '모든 태그'}
          description={
            tag
              ? `'${tag}' 분실물 열심히 찾는 중...`
              : '모든 분실물 열심히 찾는 중...'
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },

  markerImage: {
    width: '100%',
    height: '100%',
  },

  calloutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 6,

    boxShadow: '2px 2px 20px rgba(22, 26, 62, 0.1)'
  },

  calloutImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },


  backText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
