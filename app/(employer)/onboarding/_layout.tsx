import { Stack } from 'expo-router';

export default function EmployerOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FBFAFF' } }}>
      <Stack.Screen name="property" />
      <Stack.Screen name="location" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="compliance" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
