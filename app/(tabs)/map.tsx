import ButtonBack from '@/components/ButtonBack';
import CardNoIcon from '@/components/CardNoIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, CalloutSubview, Marker } from 'react-native-maps';

const CENTER = {
  latitude: 35.2285,
  longitude: 126.843,
  latitudeDelta: 0.0075,
  longitudeDelta: 0.0075,
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
  const [modalVisible, setModalVisible] = useState(false);

  const filteredMarkers = useMemo(() => {
    if (!tag) return DATA;
    return DATA.filter((item) => item.tag === tag);
  }, [tag]);

  const handleClaim = () => {
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      router.replace('/');
    }, 2000);
  };

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

                <CalloutSubview onPress={handleClaim}>
                  <View className='w-full 
                    py-2
                    mx-2
                    mt-2
                    rounded-full 
                    items-center 
                    justify-center 
                    bg-black'>
                    <Text className='font-pretendard-bold text-[14px] text-white'>
                      제 물건이에요!
                    </Text>
                  </View>
                </CalloutSubview>

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

      <View style={{ position: 'absolute', bottom: 64, right: 32, left: 32 }}>
        <CardNoIcon
          title={tag || '모든 태그'}
          description={
            tag
              ? `'${tag}' 분실물 열심히 찾는 중...`
              : '모든 분실물 열심히 찾는 중...'
          }
        />
      </View>

      {/* 🎉 축하 모달 */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🎉 축하합니다!</Text>
            <Text style={styles.modalText}>물건을 찾았어요!</Text>
          </View>
        </View>
      </Modal>

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
  },

  

  claimText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
  },

  calloutImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },

  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
});