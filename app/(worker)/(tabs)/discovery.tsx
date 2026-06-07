import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Clock, MapPin, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '../../../src/lib/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_MARGIN = 10;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

const DEFAULT_REGION: Region = {
  latitude: 17.385,
  longitude: 78.4867,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const RADIUS_MAP: Record<string, number> = {
  'Local (5km)': 5,
  'City (15km)': 15,
  'Regional (50km)': 50,
};
// latitudeDelta = (radius * 2 * 1.3) / 111 — 1.3x buffer so circle fits with padding
const RADIUS_DELTA: Record<string, number> = {
  'Local (5km)': 0.12,
  'City (15km)': 0.35,
  'Regional (50km)': 1.18,
};
const radiusOptions = Object.keys(RADIUS_MAP);

const PAY_SUFFIX: Record<string, string> = {
  PER_SHIFT: '/shift',
  DAILY: '/day',
  MONTHLY: '/mo',
  ANNUAL: '/yr',
};

function formatPay(job: any): { full: string; short: string } {
  const suffix = PAY_SUFFIX[job.pay_type as string] ?? '';
  if (job.pay_min != null && job.pay_max != null) {
    return {
      full: `₹${job.pay_min.toLocaleString()} – ₹${job.pay_max.toLocaleString()}${suffix}`,
      short: `₹${Math.round(job.pay_min / 1000)}k–${Math.round(job.pay_max / 1000)}k${suffix}`,
    };
  }
  if (job.pay_rate != null) {
    return {
      full: `₹${job.pay_rate.toLocaleString()}${suffix}`,
      short: `₹${Math.round(job.pay_rate / 1000)}k${suffix}`,
    };
  }
  return { full: 'Negotiable', short: '–' };
}


function SkeletonCard({ index }: { index: number }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        { marginLeft: index === 0 ? 20 : CARD_MARGIN, opacity: pulse },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.skeletonHeader}>
          <View style={[styles.skeletonBlock, { width: 80, height: 22, borderRadius: 8 }]} />
          <View style={[styles.skeletonBlock, { width: 32, height: 32, borderRadius: 16 }]} />
        </View>
        <View style={[styles.skeletonBlock, { width: '70%', height: 18, borderRadius: 6, marginBottom: 8 }]} />
        <View style={[styles.skeletonBlock, { width: '45%', height: 14, borderRadius: 6, marginBottom: 20 }]} />
        <View style={styles.skeletonInfoRow}>
          <View style={[styles.skeletonBlock, { width: 90, height: 14, borderRadius: 6 }]} />
          <View style={[styles.skeletonBlock, { width: 80, height: 14, borderRadius: 6 }]} />
        </View>
        <View style={[styles.skeletonBlock, { width: '100%', height: 52, borderRadius: 16, marginTop: 4 }]} />
      </View>
    </Animated.View>
  );
}

export default function JobDiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const [activeRadius, setActiveRadius] = useState(radiusOptions[0]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);

  const fetchJobs = useCallback(async (coords: { lat: number; lng: number } | null, radius: string) => {
    try {
      setLoading(true);
      const radiusKm = RADIUS_MAP[radius];
      const params = new URLSearchParams();
      if (coords) {
        params.append('lat', coords.lat.toString());
        params.append('lng', coords.lng.toString());
        params.append('max_distance_km', radiusKm.toString());
      }
      const response = await api.get(`/jobs/feed?${params.toString()}`);
      if (response.data.success) {
        setJobs(response.data.data ?? []);
        console.log('Fetched jobs:', response.data.data);
        setSelectedJobIndex(0);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user location once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchJobs(null, activeRadius);
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        const region: Region = {
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        };
        setUserCoords(coords);
        setMapRegion(region);
      } catch (error) {
        console.warn('Could not fetch location:', error);
        fetchJobs(null, activeRadius);
      }
    })();
  }, []);

  // Fetch jobs whenever userCoords settles or radius changes
  useEffect(() => {
    if (userCoords !== null) {
      fetchJobs(userCoords, activeRadius);
    }
  }, [userCoords, activeRadius]);

  // Animate map to user when map is ready and coords are available
  useEffect(() => {
    if (mapReady && userCoords) {
      const delta = RADIUS_DELTA[activeRadius];
      mapRef.current?.animateToRegion({
        latitude: userCoords.lat,
        longitude: userCoords.lng,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }, 800);
    }
  }, [mapReady, userCoords]);

  // Zoom in/out when radius filter changes
  useEffect(() => {
    if (mapReady && userCoords) {
      const delta = RADIUS_DELTA[activeRadius];
      mapRef.current?.animateToRegion({
        latitude: userCoords.lat,
        longitude: userCoords.lng,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }, 600);
    }
  }, [activeRadius]);

  const focusJob = (index: number) => {
    setSelectedJobIndex(index);
    const job = jobs[index];
    const coords = job?.location?.coordinates;
    if (coords && mapReady) {
      mapRef.current?.animateToRegion({
        latitude: coords[1],
        longitude: coords[0],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 400);
    }
  };

  const onMarkerPress = (index: number) => {
    focusJob(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / FULL_CARD_WIDTH);
    if (index !== selectedJobIndex && index >= 0 && index < jobs.length) {
      focusJob(index);
    }
  };

  const renderJobCard = ({ item, index }: { item: any; index: number }) => {
    const pay = formatPay(item);
    return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/(worker)/job/${item._id}`)}
      style={[styles.card, { marginLeft: index === 0 ? 20 : CARD_MARGIN }]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Hiring Now</Text>
          </View>
          <View style={styles.iconCircle}>
            <Clock size={16} color="#475569" />
          </View>
        </View>

        <Text style={styles.title}>{item.job_title}</Text>
        <Text style={styles.subtitle}>{item.employer_property_type || 'Hospitality'}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Wallet size={16} color="#000666" />
            <Text style={styles.infoText}>{pay.full}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={16} color="#000666" />
            <Text style={styles.infoText}>
              {item.distance_km != null ? `${Number(item.distance_km).toFixed(1)} km` : 'Nearby'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/(worker)/job/${item._id}`)}
        >
          <Text style={styles.buttonText}>View Details</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>Job Discovery</Text>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {userCoords && (
          <>
            <Marker
              coordinate={{ latitude: userCoords.lat, longitude: userCoords.lng }}
              title="You are here"
              zIndex={999}
            >
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
            <Circle
              center={{ latitude: userCoords.lat, longitude: userCoords.lng }}
              radius={RADIUS_MAP[activeRadius] * 1000}
              strokeWidth={1}
              strokeColor="rgba(0, 107, 255, 0.3)"
              fillColor="rgba(0, 107, 255, 0.05)"
            />
          </>
        )}

        {jobs.map((job, index) => {
          const coords = job?.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const lat = coords[1];
          const lng = coords[0];
          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          const isSelected = selectedJobIndex === index;
          const payLabel = formatPay(job).short !== '–' ? formatPay(job).short : null;
          const distLabel = job.distance_km != null
            ? `${Number(job.distance_km).toFixed(1)}km`
            : null;

          return (
            <Marker
              key={job._id}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => onMarkerPress(index)}
              zIndex={isSelected ? 100 : 1}
              tracksViewChanges={false}
            >
              <View style={[styles.jobMarkerPill, isSelected && styles.jobMarkerPillSelected]}>
                {payLabel && (
                  <Text style={[styles.jobMarkerPay, isSelected && styles.jobMarkerPaySelected]}>
                    {payLabel}
                  </Text>
                )}
                {payLabel && distLabel && (
                  <View style={[styles.jobMarkerDivider, isSelected && styles.jobMarkerDividerSelected]} />
                )}
                {distLabel && (
                  <Text style={[styles.jobMarkerDist, isSelected && styles.jobMarkerDistSelected]}>
                    {distLabel}
                  </Text>
                )}
              </View>
              <View style={[styles.jobMarkerTip, isSelected && styles.jobMarkerTipSelected]} />
            </Marker>
          );
        })}
      </MapView>

      {/* Radius Filters */}
      <View style={[styles.filterContainer, { top: insets.top + 67 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterInner}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setActiveRadius(option)}
                style={[
                  styles.filterChip,
                  activeRadius === option ? styles.filterChipActive : styles.filterChipInactive,
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  activeRadius === option ? styles.filterChipTextActive : styles.filterChipTextInactive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Job Cards */}
      <View style={[styles.cardsContainer, { bottom: insets.bottom + 10 }]}>
        {loading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {[0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)}
          </ScrollView>
        ) : jobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No jobs found in this area</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={jobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={FULL_CARD_WIDTH}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingRight: 20 }}
            onScrollToIndexFailed={() => {}}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000666',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  filterContainer: {
    position: 'absolute',
    top: 67,
    width: '100%',
    zIndex: 5,
  },
  filterInner: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#000666',
    borderColor: '#000666',
  },
  filterChipInactive: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterChipTextInactive: {
    color: '#475569',
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    zIndex: 5,
  },
  emptyCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    marginVertical: 10,
    marginHorizontal: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#9a3412',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconCircle: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  button: {
    backgroundColor: '#000666',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 107, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#006BFF',
    borderWidth: 2,
    borderColor: '#fff',
  },
  skeletonBlock: {
    backgroundColor: '#e2e8f0',
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  skeletonInfoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  jobMarkerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    gap: 6,
  },
  jobMarkerPillSelected: {
    backgroundColor: '#000666',
    borderColor: '#000666',
  },
  jobMarkerPay: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  jobMarkerPaySelected: {
    color: '#fff',
  },
  jobMarkerDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#cbd5e1',
  },
  jobMarkerDividerSelected: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  jobMarkerDist: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  jobMarkerDistSelected: {
    color: 'rgba(255,255,255,0.85)',
  },
  jobMarkerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    alignSelf: 'center',
    marginTop: -1,
  },
  jobMarkerTipSelected: {
    borderTopColor: '#000666',
  },
});
