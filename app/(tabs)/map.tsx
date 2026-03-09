import ButtonBack from '@/components/ButtonBack';
import CardNoIcon from '@/components/CardNoIcon';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

const FALLBACK_IMAGE = 'https://picsum.photos/200';

const getSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const extractCoordinate = (data: any): Coordinate | null => {
  if (
    typeof data?.location?.latitude === 'number' &&
    typeof data?.location?.longitude === 'number'
  ) {
    return {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };
  }

  if (typeof data?.latitude === 'number' && typeof data?.longitude === 'number') {
    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  return null;
};

export default function TagMapScreen() {
  const params = useLocalSearchParams<{ tag?: string | string[] }>();
  const tag = getSingleParam(params.tag);
  const router = useRouter();
  const [markers, setMarkers] = useState<PhotoMarker[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, 'lostItems'), (snapshot) => {
      const nextMarkers: PhotoMarker[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const coordinate = extractCoordinate(data);
          if (!coordinate) return null;

          return {
            id: doc.id,
            coordinate,
            imageUri:
              (typeof data.imageUrl === 'string' && data.imageUrl) ||
              (typeof data.imageUri === 'string' && data.imageUri) ||
              FALLBACK_IMAGE,
            tag: typeof data.tag === 'string' ? data.tag : '기타',
          };
        })
        .filter((item): item is PhotoMarker => item !== null);

      setMarkers(nextMarkers);
    });

    return () => unsubscribe();
  }, []);

  const filteredMarkers = useMemo(() => {
    if (!tag || tag === 'all') return markers;
    return markers.filter((item) => item.tag === tag);
  }, [markers, tag]);

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
              <View style={styles.markerTagBadge}>
                <Text style={styles.markerTagBadgeText}>
                  {marker.tag.slice(0, 1)}
                </Text>
              </View>
            </View>

            <Callout tooltip>
              <View style={styles.calloutCard}>
                <View style={styles.calloutTagChip}>
                  <Text style={styles.calloutTagChipText}>#{marker.tag}</Text>
                </View>

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
                <Text style={styles.calloutTagMeta}>태그: {marker.tag}</Text>

              </View>
            </Callout>

          </Marker>
        ))}
      </MapView>

      <ButtonBack />

      <View style={{ position: 'absolute', bottom: 64, right: 32, left: 32 }}>
        <CardNoIcon
          title={!tag || tag === 'all' ? '모든 태그' : tag}
          description={
            tag && tag !== 'all'
              ? `'${tag}' 분실물 열심히 찾는 중...`
              : filteredMarkers.length
                ? `총 ${filteredMarkers.length}개의 분실물을 찾는 중...`
                : '등록된 분실물이 아직 없어요.'
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

  markerTagBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'white',
  },

  markerTagBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },

  calloutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 6,
    width: 184,
  },

  calloutTagChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },

  calloutTagChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },

  

  claimText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
  },

  calloutImage: {
    width: 172,
    height: 160,
    borderRadius: 12,
  },

  calloutTagMeta: {
    marginTop: 8,
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
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
