import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function BackFloatingButton() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.button}
      onPress={() => router.back()}
    >
      <Text style={styles.text}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 110,
    right: 30,

    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

    boxShadow: '2px 2px 20px rgba(22, 26, 62, 0.1)'
  },

  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});