import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform
} from 'react-native';

const SplashScreen: React.FC = () => {
  // Simple animation for the progress bar to make the splash screen feel alive
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 2500, // 2.5 seconds loading simulation
      useNativeDriver: false, // width interpolation doesn't support native driver
    }).start();
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    // Standardizing on the primary brand color for the root background
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor="#000666" />
      
      <View className="flex-1 relative items-center justify-between overflow-hidden">
        
        {/* Ambient Background Elements (Fallback for CSS blurs & gradients) */}
        <View className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container opacity-30 rounded-full" />
        <View className="absolute -bottom-10 -left-10 w-80 h-80 bg-secondary opacity-20 rounded-full" />

        {/* Top spacer to balance the flex layout */}
        <View className="flex-1" />

        {/* Center Content: Identity Lockup */}
        <View className="flex-col items-center justify-center z-10 px-6 w-full">
          {/* Logo Section */}
          <View className="mb-8 items-center">
            <Text 
              className="text-7xl font-black text-on-primary tracking-tighter italic"
              style={{ includeFontPadding: false }} // Improves custom font vertical centering on Android
            >
              TEJJ
            </Text>
            <View className="h-1.5 w-16 bg-secondary mt-4 rounded-full" />
          </View>

          {/* Descriptive Text */}
          <View className="space-y-4 items-center">
            <Text className="text-on-primary text-lg font-medium tracking-wide opacity-90 text-center">
              Premium Hospitality Staffing
            </Text>
            
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-on-primary-container text-[10px] font-bold tracking-widest uppercase">Precision</Text>
              <View className="w-1 h-1 rounded-full bg-on-primary-container" />
              <Text className="text-on-primary-container text-[10px] font-bold tracking-widest uppercase">Excellence</Text>
              <View className="w-1 h-1 rounded-full bg-on-primary-container" />
              <Text className="text-on-primary-container text-[10px] font-bold tracking-widest uppercase">Trust</Text>
            </View>
          </View>
        </View>

        {/* Bottom Content: Meta & Status */}
        <View className="flex-1 justify-end w-full max-w-xs pb-12 z-10 px-6">
          
          {/* Loading Indicator */}
          <View className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
            <Animated.View 
              className="h-full bg-on-primary-container rounded-full" 
              style={{ width }} 
            />
          </View>

          <View className="flex-col items-center gap-3">
            <Text className="text-white/50 text-[10px] font-bold tracking-widest uppercase">
              Version 1.0
            </Text>
            
            {/* Status Badge */}
            <View className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Text className="text-on-primary text-[10px] font-bold tracking-widest uppercase">
                The Resilient Concierge
              </Text>
            </View>
          </View>
          
        </View>

      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;