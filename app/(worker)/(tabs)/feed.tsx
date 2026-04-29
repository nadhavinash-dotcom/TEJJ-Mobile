import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView,
  ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import {
  Navigation, MapPin, Wallet, Clock, ArrowRight, BellRing, Briefcase, TrendingUp, Star
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
  const [refreshing, setRefreshing] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Access', 'Enable location access to find jobs near you.');
        fetchJobs(); // Fetch without coordinates
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
        fetchJobs(); // Fetch without coordinates on error
      }
    })();
  }, []);

  useEffect(() => {
    if (userCoords !== null || !loading) {
      fetchJobs();
    }
  }, [activeRadius, relocation, userCoords]);

  const fetchJobs = async () => {
    try {
      const radiusKm = RADIUS_MAP[activeRadius];
      let queryParams = new URLSearchParams();
      
      if (userCoords) {
        queryParams.append('lat', userCoords.lat.toString());
        queryParams.append('lng', userCoords.lng.toString());
      }

      // If relocation is enabled or national is selected, use a massive distance to cover everything
      if (relocation || radiusKm === null) {
        queryParams.append('max_distance_km', '20000');
      } else if (radiusKm) {
        queryParams.append('max_distance_km', radiusKm.toString());
      }

      const response = await api.get(`/jobs/feed?${queryParams.toString()}`);
      // console.log('jobs' ,response.data);
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const renderJobCard = (job: any) => {
    const isAboveMarket = job.market_rate_delta && job.market_rate_delta > 0;

    return (
      <TouchableOpacity
        key={job._id}
        onPress={() => router.push(`/(worker)/job/${job._id}`)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm active:opacity-95 border border-slate-200 mb-6"
      >
        <View className="relative h-44 w-full bg-slate-100">
          <Image
            source={{ uri: job.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-slate-900/40" />

          {/* Top Tags */}
          <View className="absolute top-4 left-4 flex-row gap-2">
            {job.lane === 1 && (
              <View className="bg-emerald-500 px-3 py-1.5 rounded-lg shadow-sm">
                <Text className="text-white text-xs font-bold uppercase tracking-wider">Fast Track</Text>
              </View>
            )}
            {job.sups_score && job.sups_score > 80 && (
              <View className="bg-amber-500 flex-row items-center gap-1 px-3 py-1.5 rounded-lg shadow-sm">
                <Star color="#ffffff" size={12} fill="#ffffff" />
                <Text className="text-white text-xs font-bold uppercase tracking-wider">High Match</Text>
              </View>
            )}
          </View>

          <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-end">
            <View className="flex-1">
               <Text className="text-white/90 font-medium text-xs mb-1 uppercase tracking-wider">
                 {job.employer_property_type || 'Hospitality'}
               </Text>
               <Text className="text-white font-bold text-xl leading-tight drop-shadow-md">
                 {job.job_title || job.primary_skill || 'Position Available'}
               </Text>
            </View>
            {job.distance_km !== undefined && (
              <View className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
                <MapPin color="#0f172a" size={12} />
                <Text className="font-bold text-[11px] text-slate-900">
                  {job.distance_km} km
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <MapPin color="#64748b" size={16} />
            <Text className="text-slate-600 font-medium text-sm">
              {job.employer_area_locality || 'Location Pending'}
            </Text>
            {job.employer_gstin_verified && (
              <View className="bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                <Text className="text-emerald-700 text-[10px] font-bold">VERIFIED</Text>
              </View>
            )}
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            <View className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl ${isAboveMarket ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50'}`}>
              <Wallet color={isAboveMarket ? "#059669" : "#475569"} size={16} />
              <Text className={`text-sm font-bold ${isAboveMarket ? 'text-emerald-700' : 'text-slate-700'}`}>
                ₹{job.pay_rate} <Text className="font-medium text-xs">/ {job.pay_type === 'PER_SHIFT' ? 'Shift' : 'Month'}</Text>
              </Text>
            </View>

            <View className="bg-slate-50 flex-row items-center gap-1.5 px-3 py-2 rounded-xl">
              <Clock color="#475569" size={16} />
              <Text className="text-sm font-medium text-slate-700">
                {job.shift_duration_hours ? `${job.shift_duration_hours}h Shift` : 'Full-time'}
              </Text>
            </View>

            <View className="bg-slate-50 flex-row items-center gap-1.5 px-3 py-2 rounded-xl">
              <Briefcase color="#475569" size={16} />
              <Text className="text-sm font-medium text-slate-700">
                {job.number_of_openings ? `${job.number_of_openings} Openings` : 'Hiring'}
              </Text>
            </View>
          </View>

          <View className="w-full bg-primary active:bg-slate-800 h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
            <Text className="text-white font-bold text-[15px] tracking-wide">View Details</Text>
            <ArrowRight color="#ffffff" size={18} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0f172a" />}
      >
        <View className="mb-8 px-2">
          <Text className="font-bold text-slate-500 uppercase tracking-widest text-[11px] mb-2">
            Opportunities Near You
          </Text>
          <Text className="font-extrabold text-3xl text-slate-900 leading-tight">
            Find your next <Text className="text-primary">Culinary</Text> mission.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl mb-8 shadow-sm border border-slate-100 space-y-5">
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Navigation color="#0f172a" size={18} />
              <Text className="font-bold text-base text-slate-900">Search Radius</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <View className="flex-row gap-2 pr-4">
                {radiusOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setActiveRadius(option)}
                    className={`px-5 py-2.5 rounded-xl border ${
                      activeRadius === option
                        ? 'bg-primary border-primary'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text className={`font-semibold text-[13px] ${
                      activeRadius === option ? 'text-white' : 'text-slate-600'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="h-px w-full bg-slate-100" />

          <View className="mt-4 flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <View className="flex-1 pr-4">
              <Text className="font-bold text-slate-900">Open to Relocation</Text>
              <Text className="text-xs text-slate-500 mt-1">Include nationwide matches</Text>
            </View>
            <TouchableOpacity
              onPress={() => setRelocation(!relocation)}
              className={`w-12 h-6 rounded-full justify-center px-1 transition-colors ${
                relocation ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <View className={`w-4 h-4 bg-white rounded-full transition-transform ${
                relocation ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="space-y-6">
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#0f172a" className="mt-10" />
          ) : jobs.length === 0 ? (
            <View className="items-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                <Briefcase color="#94a3b8" size={32} />
              </View>
              <Text className="text-slate-900 font-bold text-lg mb-2">No jobs found</Text>
              <Text className="text-slate-500 font-medium text-sm text-center px-8">
                Try expanding your search radius or turning on relocation to see more opportunities.
              </Text>
            </View>
          ) : (
            jobs.map(renderJobCard)
          )}

          <View className="bg-primary rounded-2xl p-8 relative overflow-hidden mt-4">
            <View className="absolute -right-16 -top-16 w-48 h-48 bg-on-primary-fixed-variant rounded-full blur-2xl" />
            <Text className="font-bold text-2xl text-white mb-3 z-10">
              Can't find the right fit?
            </Text>
            <Text className="text-slate-300 text-sm leading-relaxed mb-8 z-10 font-medium">
              Set up custom job alerts and be the first to know when luxury hospitality roles match your distance preferences.
            </Text>
            <TouchableOpacity className="bg-white h-12 px-6 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90 self-start z-10">
              <Text className="text-slate-900 font-bold text-sm">Create Job Alert</Text>
              <BellRing color="#0f172a" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
