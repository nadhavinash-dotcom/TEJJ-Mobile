import { Stack } from 'expo-router';

export default function EmployerOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
      <Stack.Screen name="role-select" />
      <Stack.Screen name="property" />
      <Stack.Screen name="location" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="compliance" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
