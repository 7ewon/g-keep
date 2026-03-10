import ButtonBack from '@/components/ButtonBack';
import CardNoIcon from '@/components/CardNoIcon';
import { db } from '@/lib/firebase';
import { deleteLostItem } from '@/services/lostItemService';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, View } from 'react-native';
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
  imagePath?: string;
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
  const [markers, setMarkers] = useState<PhotoMarker[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, 'lostItems'), (snapshot) => {
      const nextMarkers = snapshot.docs.reduce<PhotoMarker[]>((acc, doc) => {
          const data = doc.data();
          const coordinate = extractCoordinate(data);
          if (!coordinate) return acc;

          const imagePath =
            typeof data.imagePath === 'string' ? data.imagePath : undefined;

          const marker: PhotoMarker = {
            id: doc.id,
            coordinate,
            imageUri:
              (typeof data.imageUrl === 'string' && data.imageUrl) ||
              (typeof data.imageUri === 'string' && data.imageUri) ||
              FALLBACK_IMAGE,
            tag: typeof data.tag === 'string' ? data.tag : '기타',
          };

          if (imagePath) {
            marker.imagePath = imagePath;
          }

          acc.push(marker);
          return acc;
        }, []);

      setMarkers(nextMarkers);
    });

    return () => unsubscribe();
  }, []);

  const filteredMarkers = useMemo(() => {
    if (!tag || tag === 'all') return markers;
    return markers.filter((item) => item.tag === tag);
  }, [markers, tag]);

  const removeClaimedItem = async (marker: PhotoMarker) => {
    if (deletingId) return;

    setDeletingId(marker.id);

    try {
      await deleteLostItem({
        id: marker.id,
        imagePath: marker.imagePath,
      });

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 1400);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('삭제 실패', message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClaim = (marker: PhotoMarker) => {
    if (deletingId) return;

    Alert.alert(
      '내 물건으로 처리할까요?',
      '선택하면 Firebase에서 삭제되고 지도에서도 사라집니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            void removeClaimedItem(marker);
          },
        },
      ],
    );
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

                <CalloutSubview onPress={() => handleClaim(marker)}>
                  <View
                    style={[
                      styles.claimButton,
                      deletingId === marker.id && styles.claimButtonDisabled,
                    ]}
                  >
                    <Text style={styles.claimText}>
                      {deletingId === marker.id ? '삭제 중...' : '제 물건이에요!'}
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
            <Text style={styles.modalTitle}>삭제 완료</Text>
            <Text style={styles.modalText}>지도에서 해당 물건을 제거했어요.</Text>
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

  
  claimButton: {
    width: '100%',
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  claimButtonDisabled: {
    opacity: 0.7,
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
