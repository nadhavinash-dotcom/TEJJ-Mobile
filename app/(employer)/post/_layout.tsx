import { Stack } from 'expo-router';

export default function PostLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
      <Stack.Screen name="lane" />
      <Stack.Screen name="template" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
