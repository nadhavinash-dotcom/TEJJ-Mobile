import { Stack } from 'expo-router';

export default function WorkerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job/[id]" />
      <Stack.Screen name="applied/[id]" />
      <Stack.Screen name="match/[id]" />
      <Stack.Screen name="arrival-reminder" />
      <Stack.Screen name="qr-code" />
      <Stack.Screen name="arrival-confirmed" />
      <Stack.Screen name="rate-employer/[id]" />
      <Stack.Screen name="benefits" />
      <Stack.Screen name="agent" />
      <Stack.Screen name="referral" />
      <Stack.Screen name="whisper" />
    </Stack>
  );
}
