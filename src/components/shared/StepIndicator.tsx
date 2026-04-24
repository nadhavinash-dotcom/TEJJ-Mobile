import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = useRef(new Animated.Value((currentStep - 1) / totalSteps)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: currentStep / totalSteps,
      useNativeDriver: false, // width cannot be animated with native driver
      tension: 20,
      friction: 7,
    }).start();
  }, [currentStep, totalSteps]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-end mb-2">
        <View>
          <Text className="text-navy-400 text-xs font-bold uppercase tracking-wider">Onboarding</Text>
          <Text className="text-white text-xl font-bold">Step {currentStep}</Text>
        </View>
        <Text className="text-navy-400 text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}% Complete</Text>
      </View>
      
      <View className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
        <Animated.View 
          style={{
            height: '100%',
            backgroundColor: '#F59E0B',
            borderRadius: 999,
            width: width,
          }}
        />
      </View>
    </View>
  );
}
