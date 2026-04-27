import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView,
  ActivityIndicator, Alert
} from 'react-native';
import {
  Navigation, MapPin, Wallet, Clock, ArrowRight, BellRing
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '../../../src/lib/api';

const RADIUS_MAP: Record<string, number | null> = {
  'Local (5km)': 5,
  'City (15km)': 15,
  'Regional (50km)': 50,
  'National': null,
};

const radiusOptions = Object.keys(RADIUS_MAP);

export default function WorkerFeedScreen() {
  const [activeRadius, setActiveRadius] = useState(radiusOptions[0]);
  const [relocation, setRelocation] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to find jobs near you.');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.warn("Could not fetch location", error);
      }
    })();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [activeRadius, relocation, userCoords]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const radiusKm = RADIUS_MAP[activeRadius];
      let queryParams = new URLSearchParams();
      if (userCoords && radiusKm) {
        queryParams.append('lat', userCoords.lat.toString());
        queryParams.append('lng', userCoords.lng.toString());
        queryParams.append('radiusInKm', radiusKm.toString());
      }
      if (relocation || !radiusKm) {
        queryParams.append('includeRelocation', 'true');
      }

      const response = await api.get(`/jobs/feed?${queryParams.toString()}`);
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 px-2">
          <Text className="font-bold text-secondary uppercase tracking-widest text-[10px] mb-2">
            Opportunities Near You
          </Text>
          <Text className="font-extrabold text-4xl text-primary leading-tight">
            Find your next <Text className="text-secondary">Culinary</Text> mission.
          </Text>
        </View>

        <View className="bg-surface-container-low p-5 rounded-2xl mb-8 space-y-6">
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Navigation color="#000666" size={20} />
              <Text className="font-bold text-lg text-primary">Search Radius</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <View className="flex-row gap-2 pr-4">
                {radiusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setActiveRadius(option)}
                    className={`px-5 py-2.5 rounded-lg ${activeRadius === option
                      ? 'bg-primary shadow-sm shadow-primary/30'
                      : 'bg-surface-container-lowest'
                      }`}
                  >
                    <Text className={`font-semibold text-sm ${activeRadius === option ? 'text-white' : 'text-on-surface-variant'
                      }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="h-px w-full bg-outline-variant/30" />

          <View className="flex-row items-center justify-between bg-surface-container-highest/50 p-4 rounded-xl border border-outline-variant/20">
            <View className="flex-1 pr-4">
              <Text className="font-bold text-on-surface">Open to Relocation</Text>
              <Text className="text-xs text-on-surface-variant mt-0.5">Include nationwide matches</Text>
            </View>
            <TouchableOpacity
              onPress={() => setRelocation(!relocation)}
              className={`w-12 h-6 rounded-full justify-center px-1 ${relocation ? 'bg-primary-container' : 'bg-outline-variant'
                }`}
            >
              <View className={`w-4 h-4 bg-white rounded-full ${relocation ? 'translate-x-6' : 'translate-x-0'
                }`} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="space-y-6">
          {loading ? (
            <ActivityIndicator size="large" color="#1A237E" className="mt-10" />
          ) : jobs.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-on-surface-variant font-medium text-lg">No jobs found in this area.</Text>
            </View>
          ) : (
            jobs.map((job) => (
              <TouchableOpacity
                key={job._id}
                onPress={() => router.push(`/(worker)/job/${job._id}`)}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm active:opacity-95 border border-surface-container-highest/50 mb-6"
              >
                <View className="relative h-48 w-full bg-surface-container-high">
                  <Image
                    source={{ uri: job.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/10" />

                  {job.status === 'BROADCASTING' && (
                    <View className="absolute top-4 left-4 bg-tertiary-container px-3 py-1.5 rounded-lg shadow-sm">
                      <Text className="text-tertiary-fixed text-xs font-bold uppercase tracking-wider">Hiring Now</Text>
                    </View>
                  )}

                  <View className="absolute bottom-4 right-4 bg-surface/95 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
                    <MapPin color="#006b5e" size={14} />
                    <Text className="font-bold text-[11px] text-on-surface">
                      {job.employer_id?.city || 'Local Area'}
                    </Text>
                  </View>
                </View>

                <View className="p-6">
                  <View className="mb-4">
                    <Text className="font-bold text-xl text-primary mb-1">{job.job_title || 'Position Available'}</Text>
                    <Text className="text-on-surface-variant font-medium">{job.employer_id?.property_name || 'Confidential Employer'}</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2 mb-6">
                    <View className="bg-surface-container-high flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg">
                      <Wallet color="#454652" size={14} />
                      <Text className="text-xs font-semibold text-on-surface-variant">
                        ₹{job.pay_rate} {job.pay_type === 'PER_SHIFT' ? '/ Shift' : '/ Month'}
                      </Text>
                    </View>
                    <View className="bg-surface-container-high flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg">
                      <Clock color="#454652" size={14} />
                      <Text className="text-xs font-semibold text-on-surface-variant">
                        {job.shift_duration_hours ? `${job.shift_duration_hours}h Shift` : 'Full-time'}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full bg-primary h-14 rounded-xl flex-row items-center justify-center gap-2">
                    <Text className="text-white font-bold text-sm tracking-wide">View Details</Text>
                    <ArrowRight color="#ffffff" size={18} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          <View className="bg-primary-container rounded-2xl p-8 relative overflow-hidden mt-2">
            <View className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/30 rounded-full" />
            <Text className="font-extrabold text-2xl text-on-primary-container mb-4 z-10">
              Can't find the right fit?
            </Text>
            <Text className="text-on-primary-container/80 text-sm leading-relaxed mb-8 z-10">
              Set up custom job alerts and be the first to know when luxury hospitality roles match your distance preferences.
            </Text>
            <TouchableOpacity className="bg-white h-14 px-6 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90 self-start z-10">
              <Text className="text-primary font-bold text-sm">Create Job Alert</Text>
              <BellRing color="#000666" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
