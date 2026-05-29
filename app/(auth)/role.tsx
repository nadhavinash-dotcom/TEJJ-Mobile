import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HardHat, Briefcase, ArrowRight } from 'lucide-react-native';
import { StyledMenu } from '../../src/components/tell/Icons';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { User } from '@/types';
import { navigateHome } from '@/utils/navigate-home';

const userTypes = [
  {
    id: 'worker',
    label: 'Worker',
    description: 'Find jobs, track shifts, and manage your daily schedule.',
    Icon: HardHat
  },
  {
    id: 'employer',
    label: 'Employer',
    description: 'Post jobs, hire talent, and manage your workforce easily.',
    Icon: Briefcase
  },
];

export default function RoleScreen() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {  setActiveRole } = useAuthStore();

  const handleContinue = async () => {
    if (!selectedUserType) return;

    setIsLoading(true);
    try {
      const response = await api.patch('/auth/update-user', {
        active_role: selectedUserType,
      });

      if (response.data.success) {
        const { role } = response.data;
        setActiveRole(role);
        navigateHome();
      }
    } catch (error: any) {
      console.error("Role Selection Error:", error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to set user role. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLabel = userTypes.find(u => u.id === selectedUserType)?.label;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-[#fbf8fe]/90 flex-row justify-between items-center px-6 py-4 z-50 border-b border-surface-container-highest/20">
        <View className="flex-row items-center gap-4">
          {/* <TouchableOpacity className="active:opacity-70 p-1">
            <StyledMenu color="#000666" size={24} />
          </TouchableOpacity> */}
          <Text className="font-bold text-xl tracking-tight text-primary">TEJJ</Text>
        </View>
        <Text className="text-sm font-bold text-[#44464f]">v1.0</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-xl mx-auto flex-1 flex-col">
          <View className="mb-10 items-center sm:items-start">
            <Text className="font-extrabold text-4xl sm:text-5xl text-primary tracking-tight mb-3 text-center sm:text-left">
              Choose your role
            </Text>
            <Text className="text-base text-gray-500 text-center sm:text-left mb-5 px-4 sm:px-0">
              Tell us how you'll be using TEJJ so we can tailor your experience.
            </Text>
            <View className="h-1.5 w-12 bg-secondary rounded-full" />
          </View>

          <View className="flex-col gap-y-4 mb-10">
            {userTypes.map((userType) => {
              const isSelected = selectedUserType === userType.id;
              const IconComponent = userType.Icon;

              return (
                <TouchableOpacity
                  key={userType.id}
                  onPress={() => setSelectedUserType(userType.id)}
                  activeOpacity={0.7}
                  className={`w-full flex-row items-center p-5 rounded-3xl border-2 ${isSelected
                    ? 'bg-surface-container-lowest border-primary'
                    : 'bg-surface-container-lowest border-transparent'
                    }`}
                  style={!isSelected ? {
                    shadowColor: '#1b1b1f',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 12,
                    elevation: 2,
                  } : undefined}
                >
                  <View className={`p-4 rounded-2xl mr-4 ${isSelected ? 'bg-primary' : 'bg-gray-100'
                    }`}>
                    <IconComponent
                      color={isSelected ? '#ffffff' : '#000666'}
                      size={28}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className={`text-2xl font-bold mb-1 ${isSelected ? 'text-primary' : 'text-on-surface'
                      }`}>
                      {userType.label}
                    </Text>
                    <Text className={`text-sm leading-tight ${isSelected ? 'text-primary/80' : 'text-gray-500'
                      }`}>
                      {userType.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mt-auto pt-4 pb-8">
            <TouchableOpacity
              disabled={!selectedUserType || isLoading}
              className={`flex-row items-center justify-center gap-3 py-4 px-8 rounded-full w-full ${selectedUserType
                ? 'bg-primary active:opacity-90'
                : 'bg-gray-200'
                }`}
              onPress={handleContinue}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className={`font-bold text-lg ${selectedUserType ? 'text-white' : 'text-gray-400'
                  }`}>
                  {selectedUserType ? `Continue as ${selectedLabel}` : 'Select a role to continue'}
                </Text>
              )}
              {!isLoading && selectedUserType && (
                <ArrowRight color="#ffffff" size={22} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
