import { Stack } from 'expo-router';

export default function EmployerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="post" />
      <Stack.Screen name="confirm-gate" />
      <Stack.Screen name="worker/[id]" />
      <Stack.Screen name="qr-scanner" />
      <Stack.Screen name="rate-worker/[id]" />
      <Stack.Screen name="applicants/[jobId]" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="interview/[id]" />
      <Stack.Screen name="outcome/[id]" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="crew-pools" />
      <Stack.Screen name="retain" />
    </Stack>
  );
}
