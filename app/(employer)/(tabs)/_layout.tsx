import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
}

export default function EmployerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f0edf2',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#000666',
        tabBarInactiveTintColor: '#454652',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} /> }} />
      <Tabs.Screen name="jobs" options={{ title: 'Jobs', tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon icon="🏨" focused={focused} /> }} />
    </Tabs>
  );
}
