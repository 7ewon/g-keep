# g-keep

# Firebase 연결

이 프로젝트는 `Firebase Storage`에 사진을 올리고, `Firestore`에
좌표/태그/사진 URL을 저장하도록 연결할 수 있습니다.

## 1) Firebase 콘솔 준비

- Firestore Database 생성 (Native 모드)
- Storage 생성
- 웹 앱 등록 후 SDK 설정 값 확인

## 2) 환경변수 설정

`.env.example`을 참고해 프로젝트 루트에 `.env` 파일을 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

필수 키:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

주의:

- 이 프로젝트는 `firebase` 웹 SDK를 사용하므로 `EXPO_PUBLIC_FIREBASE_APP_ID`에는
  `...:web:...` 형태의 웹 앱 App ID를 넣어야 합니다.
- iOS 앱(`...:ios:...`) App ID를 넣으면 업로드가 실패합니다.

## 3) 앱에서 업로드되는 데이터

`등록하기`를 누르면 아래 순서로 저장됩니다.

1. 선택한 이미지 파일을 `Storage/lost-items/*` 경로에 업로드
2. 다운로드 URL을 받아 Firestore `lostItems` 컬렉션에 문서 생성
3. 저장 필드: `imageUrl`, `imagePath`, `location(GeoPoint)`,
   `latitude`, `longitude`, `tag`, `createdAt`

## 4) 보안 규칙(개발용 예시)

초기 테스트용으로만 사용하세요. 운영 전에는 인증 기반 규칙으로 변경해야 합니다.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lostItems/{docId} {
      allow read, write: if true;
    }
  }
}
```

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /lost-items/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

# 커밋룰

-제목과 본문을 빈 행으로 구분한다.

-제목은 50글자 이내로 제한한다.

-제목의 첫 글자는 대문자로 작성한다.

-제목 끝에는 마침표를 넣지 않는다.

-제목은 명령문으로 사용하며 과거형을 사용하지 않는다.

-본문의 각 행은 72글자 내로 제한한다.

-어떻게 보다는 무엇과 왜를 설명한다.


# 커밋 메시지 구조

Header, Body, Footer는 빈 행으로 구분한다.

타입(스코프): 주제(제목) - Header(헤더)

본문 - Body(바디)

바닥글 - Footer

feat	새로운 기능에 대한 커밋

fix	버그 수정에 대한 커밋

build	빌드 관련 파일 수정 / 모듈 설치 또는 삭제에 대한 커밋

chore	그 외 자잘한 수정에 대한 커밋

ci	ci 관련 설정 수정에 대한 커밋

docs	문서 수정에 대한 커밋

style	코드 스타일 혹은 포맷 등에 관한 커밋

refactor	코드 리팩토링에 대한 커밋

test	테스트 코드 수정에 대한 커밋

perf	성능 개선에 대한 커밋

Body는 Header에서 표현할 수 없는 상세한 내용을 적는다.

Header에서 충분히 표현할 수 있다면 생략 가능하다.

Footer는 바닥글로 어떤 이슈에서 왔는지 같은 참조 정보들을 추가하는 용도로 사용한다.

예를 들어 특정 이슈를 참조하려면 Issues #1234 와 같이 작성하면 된다.

Footer는 생략 가능하다. 여기선 생략함.

# 예시

git commit -m "fix: Safari에서 모달을 띄웠을 때 스크롤 이슈 수정

모바일 사파리에서 Carousel 모달을 띄웠을 때,
모달 밖의 상하 스크롤이 움직이는 이슈 수정.
