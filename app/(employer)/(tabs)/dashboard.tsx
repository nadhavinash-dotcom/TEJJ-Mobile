import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import {
  StyledMenu,
  StyledTrendingUp,
  StyledChefHat,
  StyledArrowRight,
  StyledPlus,
  StyledBriefcase,
  StyledClipboardCheck,
  StyledUserCircle,
  StyledFilePlus,
  StyledLogOut,
  StyledX,
  StyledUsers
} from '../../../src/components/tell/Icons';
import api from '../../../src/lib/api';
import { useAuthStore } from '../../../src/store/authStore';

export default function EmployerDashboardScreen() {
  const { clear } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/mine');
      // console.log('jobs', response.data);
      setJobs(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = () => (
    <Modal
      transparent
      visible={isSidebarOpen}
      animationType="none"
      onRequestClose={() => setIsSidebarOpen(false)}
    >
      <View className="flex-1 flex-row">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/40"
        >
          <View className="flex-1" />
        </TouchableOpacity>

        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          className="w-4/5 bg-white h-full shadow-2xl relative"
        >
          <SafeAreaView className="flex-1">
            <View className="p-8 flex-1">
              <View className="flex-row justify-between items-center mb-10">
                <Text className="text-2xl font-black italic text-primary">TEJJ</Text>
                <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
                  <StyledX color="#312e81" size={24} />
                </TouchableOpacity>
              </View>

              <View className="items-center mb-10 bg-indigo-50 p-6 rounded-3xl">
                <View className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-xl font-bold text-primary text-center">
                  My Property
                </Text>
                <Text className="text-on-surface-variant font-medium text-sm text-center">
                  Admin
                </Text>
              </View>

              <View className="gap-2">
                <TouchableOpacity
                  onPress={() => setIsSidebarOpen(false)}
                  className="flex-row items-center gap-4 p-4 rounded-2xl bg-primary/5"
                >
                  <StyledBriefcase color="#312e81" size={22} />
                  <Text className="text-primary font-bold text-lg">My Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsSidebarOpen(false);
                    router.push('/(employer)/analytics');
                  }}
                  className="flex-row items-center gap-4 p-4 rounded-2xl"
                >
                  <StyledTrendingUp color="#64748b" size={22} />
                  <Text className="text-on-surface font-semibold text-lg">Analytics</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => clear()}
                className="mt-auto flex-row items-center gap-4 p-6 border-t border-slate-100"
              >
                <StyledLogOut color="#ef4444" size={22} />
                <Text className="text-red-500 font-bold text-lg">Logout</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Sidebar />

      <View className="bg-[#fbf8fe]/90 flex-row justify-between items-center px-6 py-4 z-50 border-b border-surface-container-highest/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full"
          >
            <StyledMenu color="#312e81" size={24} />
          </TouchableOpacity>
          <Text className="text-indigo-900 font-black italic tracking-tighter text-2xl">TEJJ</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10">
          <Text className="text-4xl font-extrabold text-primary tracking-tight mb-2">
            Active Postings
          </Text>
          <Text className="text-on-surface-variant font-medium text-lg">
            Real-time overview of your hospitality staffing pipeline.
          </Text>
        </View>

        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#312e81" size="large" />
          </View>
        ) : jobs.length === 0 ? (
          <View className="items-center py-10">
            <TouchableOpacity
              onPress={() => router.push('/(employer)/post/lane')}
              className="border-2 border-dashed border-outline-variant bg-surface-container-low/30 rounded-3xl flex-col items-center justify-center p-12 w-full"
            >
              <View className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
                <StyledPlus color="#767683" size={40} />
              </View>
              <Text className="text-2xl font-bold text-primary mb-3">Create First Posting</Text>
              <Text className="text-on-surface-variant text-base text-center max-w-[280px]">
                Ready to staff up? Post an urgent shift in seconds.
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-col gap-8">
            {jobs.map((job) => (
              <View key={job._id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest/50 p-4">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="flex-row gap-4 items-center flex-1 pr-2">
                    <View className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center">
                      <StyledChefHat color="#000666" size={28} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-primary">{job.job_title}</Text>
                      <View className="flex-row items-center justify-start gap-2 px-3 py-1 rounded-full">
                        <Text className="text-on-surface-variant text-sm font-medium">₹{job.pay_rate}</Text>
                        <Text className="text-on-surface-variant text-sm font-medium">•</Text>
                        <Text className="text-on-surface-variant text-sm font-medium">{job.lane}</Text>
                        <View className="px-3 py-1 bg-secondary-container rounded-full">

                        <Text className="text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">{job.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="space-y-3 mb-6">
                  <View className="flex-row justify-between items-center bg-surface-container-low p-4 rounded-2xl">
                    <View className="flex-row items-center gap-2">
                      <StyledUsers color="#454652" size={18} />
                      <Text className="text-sm font-semibold text-on-surface-variant">Applications</Text>
                    </View>
                    <Text className="text-primary font-bold">{job?.application_count || 0}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(employer)/applicants/[jobId]', params: { jobId: job._id } })}
                  className="w-full bg-primary h-12 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90 shadow-lg shadow-primary/20"
                >
                  <Text className="text-white font-bold">View Pipeline</Text>
                  <StyledArrowRight color="#ffffff" size={20} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => router.push('/(employer)/post/lane')}
              className="border-2 border-dashed border-outline-variant bg-surface-container-low/30 rounded-3xl flex-col items-center justify-center p-8 active:bg-primary-fixed/20"
            >
              <View className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                <StyledPlus color="#767683" size={24} />
              </View>
              <Text className="text-lg font-bold text-primary">New Flash Posting</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push('/(employer)/post/lane')}
        className="absolute bottom-10 right-8 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-2xl shadow-primary/30 active:scale-95"
      >
        <StyledFilePlus color="#ffffff" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
