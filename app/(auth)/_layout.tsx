import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="phone"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}
    >
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="language" />
      <Stack.Screen name="role" />
    </Stack>
  );
}
