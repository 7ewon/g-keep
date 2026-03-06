import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import './global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Pretendard-Bold": require('../assets/fonts/Pretendard-Bold.ttf'),
    "Pretendard-Medium": require('../assets/fonts/Pretendard-Medium.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // 기본 헤더를 끄면 화면 전환 시 헤더 꿀렁임이 사라져요.
          animation: 'slide_from_right', // iOS 느낌의 부드러운 슬라이드
          animationDuration: 350, // 살짝 더 여유 있게(기본은 보통 250~300)
          contentStyle: { backgroundColor: 'white' }, // 배경색 통일로 깜빡임 방지
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} /> 
        {/* 메인 탭으로 진입할 때는 페이드 효과가 자연스러워요 */}
        
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom' // 모달은 아래서 위로!
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}