import {
  db,
  firebaseConfigWarnings,
  isFirebaseConfigured,
  missingFirebaseEnvKeys,
  storage,
} from '@/lib/firebase';
import * as FileSystem from 'expo-file-system/legacy';
import {
  GeoPoint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';

type UploadLostItemInput = {
  imageUri: string;
  latitude: number;
  longitude: number;
  tag: string;
};

type DeleteLostItemInput = {
  id: string;
  imagePath?: string | null;
};

const getFirebaseConfigErrorMessage = () => {
  const configMessage = [
    ...missingFirebaseEnvKeys.map((key) => `${key} 누락`),
    ...firebaseConfigWarnings,
  ].join(', ');

  return configMessage || '환경변수를 확인해주세요.';
};

const getImageExtension = (imageUri: string) => {
  const cleanUri = imageUri.split('?')[0];
  const fileName = cleanUri.split('/').pop() ?? '';
  const extension = fileName.includes('.') ? fileName.split('.').pop() : '';

  return (extension || 'jpg').toLowerCase();
};

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage: string,
): Promise<T> => {
  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const normalizeBucketName = (value: string) =>
  value.replace(/^gs:\/\//, '').replace(/\/+$/, '').trim();

const uploadImageViaResumableRest = async ({
  imageUri,
  imagePath,
  contentType,
}: {
  imageUri: string;
  imagePath: string;
  contentType: string;
}) => {
  const rawBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!rawBucket) {
    throw new Error('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET 누락');
  }

  const bucket = normalizeBucketName(rawBucket);
  const objectName = encodeURIComponent(imagePath);
  const startUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${objectName}`;

  const fileInfo = await FileSystem.getInfoAsync(imageUri);
  const fileSize =
    fileInfo.exists && typeof fileInfo.size === 'number' ? fileInfo.size : undefined;

  let startResponse: Response;

  try {
    startResponse = await withTimeout(
      fetch(startUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          ...(fileSize ? { 'X-Goog-Upload-Header-Content-Length': `${fileSize}` } : {}),
          'X-Goog-Upload-Header-Content-Type': contentType,
        },
        body: JSON.stringify({
          name: imagePath,
          contentType,
        }),
      }),
      15000,
      '업로드 세션 생성 시간이 초과되었습니다. 다시 시도해주세요.',
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('NSURLErrorDomain') || message.includes('Network request failed')) {
      throw new Error('네트워크 연결에 실패했습니다. 네트워크를 변경한 뒤 다시 시도해주세요.');
    }
    throw error;
  }

  if (!startResponse.ok) {
    const body = await startResponse.text();
    throw new Error(`업로드 세션 생성 실패(${startResponse.status}): ${body.slice(0, 220)}`);
  }

  const uploadUrl =
    startResponse.headers.get('x-goog-upload-url') ||
    startResponse.headers.get('X-Goog-Upload-URL');

  if (!uploadUrl) {
    throw new Error('업로드 세션 URL을 받지 못했습니다.');
  }

  const uploadResult = await withTimeout(
    FileSystem.uploadAsync(uploadUrl, imageUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      sessionType: FileSystem.FileSystemSessionType.FOREGROUND,
      headers: {
        'Content-Type': contentType,
        'X-Goog-Upload-Command': 'upload, finalize',
        'X-Goog-Upload-Offset': '0',
      },
    }),
    120000,
    '이미지 업로드가 2분을 초과했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.',
  );

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    if (uploadResult.status === 401 || uploadResult.status === 403) {
      throw new Error('Storage 권한이 없습니다. Firebase Storage 보안 규칙을 확인해주세요.');
    }

    const body = uploadResult.body?.slice(0, 220);
    throw new Error(`Storage 업로드 실패(${uploadResult.status}): ${body || '응답 없음'}`);
  }
};

export const uploadLostItem = async ({
  imageUri,
  latitude,
  longitude,
  tag,
}: UploadLostItemInput) => {
  if (!isFirebaseConfigured || !db || !storage) {
    throw new Error(`Firebase 설정 오류: ${getFirebaseConfigErrorMessage()}`);
  }

  const extension = getImageExtension(imageUri);
  const contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
  const imageName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const imagePath = `lost-items/${imageName}`;
  const storageRef = ref(storage, imagePath);

  await uploadImageViaResumableRest({
    imageUri,
    imagePath,
    contentType,
  });

  const imageUrl = await withTimeout(
    getDownloadURL(storageRef),
    10000,
    '이미지 URL 생성 시간이 초과되었습니다. 다시 시도해주세요.',
  );

  const docRef = await withTimeout(
    addDoc(collection(db, 'lostItems'), {
      imageUrl,
      imagePath,
      location: new GeoPoint(latitude, longitude),
      latitude,
      longitude,
      tag,
      createdAt: serverTimestamp(),
    }),
    10000,
    '위치 데이터 저장 시간이 초과되었습니다. 다시 시도해주세요.',
  );

  return {
    id: docRef.id,
    imageUrl,
  };
};

export const deleteLostItem = async ({ id, imagePath }: DeleteLostItemInput) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(`Firebase 설정 오류: ${getFirebaseConfigErrorMessage()}`);
  }

  await withTimeout(
    deleteDoc(doc(db, 'lostItems', id)),
    10000,
    '분실물 삭제 시간이 초과되었습니다. 다시 시도해주세요.',
  );

  if (!imagePath || !storage) return;

  try {
    await withTimeout(
      deleteObject(ref(storage, imagePath)),
      10000,
      '이미지 삭제 시간이 초과되었습니다. 다시 시도해주세요.',
    );
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'storage/object-not-found'
    ) {
      return;
    }

    console.warn('Storage 이미지 삭제 실패:', error);
  }
};
