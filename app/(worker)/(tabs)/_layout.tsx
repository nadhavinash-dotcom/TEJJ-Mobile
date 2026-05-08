import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Briefcase, CircleCheck, BookCheck, User, Navigation } from 'lucide-react-native';

// Custom component to handle the pill background and icon
function TabIcon({
  IconComponent,
  focused,
  color
}: {
  IconComponent: any;
  focused: boolean;
  color: string
}) {
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.activePill // Applies the light purple background
    ]}>
      <IconComponent
        size={22}
        color={color}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function WorkerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2D2D70', // Deep indigo/navy
        tabBarInactiveTintColor: '#6B7280', // Soft gray
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Briefcase} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="discovery"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Navigation} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applied',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={CircleCheck} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trust"
        options={{
          title: 'Trust',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={BookCheck} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={User} color={color} focused={focused} />
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
    backgroundColor: '#E8EAF6', // Very light lavender/blue background
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize', // "Activity", "Jobs", etc.
  },
});