import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="select-type" />
      <Stack.Screen
        name="(modals)/preview"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}