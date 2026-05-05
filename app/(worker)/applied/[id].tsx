import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function AppliedScreen() {
  return (
    <SafeScreen className="items-center justify-center px-6 bg-surface flex-1">
      <View className="mb-8 items-center justify-center w-24 h-24 rounded-full bg-secondary-container">
        <LucideIcon name="PartyPopper" size={48} color="#006f62" />
      </View>
      
      <Text className="text-on-surface text-3xl font-black mb-3 text-center tracking-tight">
        Application Submitted!
      </Text>
      
      <Text className="text-on-surface-variant text-base text-center mb-10 leading-relaxed px-2">
        We've securely sent your profile to the employer. You'll be notified instantly if you're shortlisted or matched.
      </Text>
      <View className='px-6 max-w-[150px] w-full'>

      <View className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 mx-8 w-full mb-10 shadow-sm">
        <Text className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-4">
          What happens next?
        </Text>
        
        <View className="gap-y-4">
          {[
            'Employer reviews your profile',
            'You get shortlisted if matched',
            'Direct match reveals the venue',
            'Show up on time for the shift'
          ].map((step, i) => (
            <View key={i} className="flex-row items-center gap-4">
              <View className="w-7 h-7 rounded-full bg-secondary items-center justify-center shadow-sm">
                <Text className="text-on-secondary text-xs font-bold">{i + 1}</Text>
              </View>
              <Text className="text-on-surface font-medium text-sm flex-1">{step}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => router.replace('/(worker)/(tabs)/feed')} 
        className="bg-primary rounded-2xl py-4 px-8 w-full shadow-md flex-row items-center justify-center gap-2 active:opacity-90 mb-3" 
        activeOpacity={0.85}
      >
        <Text className="text-on-primary font-bold text-lg tracking-wide">Browse More Jobs</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(worker)/(tabs)/applications')} activeOpacity={0.75}>
        <Text className="text-primary font-semibold text-sm mx-auto">View My Applications</Text>
      </TouchableOpacity>
      </View>
      
    </SafeScreen>
  );
}
