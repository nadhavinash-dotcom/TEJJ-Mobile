import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
      <Stack.Screen name="role" />
      <Stack.Screen name="sub-skill" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="photo" />
      <Stack.Screen name="location" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="pay" />
      <Stack.Screen name="video" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="preview" />
    </Stack>
  );
}
