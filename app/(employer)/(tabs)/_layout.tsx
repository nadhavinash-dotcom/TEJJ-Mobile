import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, Building2 } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function EmployerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
          tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#05056aff', // Deep indigo/navy
        tabBarInactiveTintColor: '#6B7280', // Soft gray
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <LayoutDashboard size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ focused, color }) => (
            <Briefcase size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Building2 size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0, // Image shows a clean seamless look or very light shadow
    height: 80,
    paddingBottom: 15,
    paddingTop: 10,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activePill: {
    backgroundColor: '#8597feff', // Very light lavender/blue background
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize', // "Activity", "Jobs", etc.
  },
});