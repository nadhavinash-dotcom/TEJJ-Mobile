import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Menu,
  List,
  MapPin,
  Wallet,
  Clock,
  ArrowRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '../../../src/lib/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_MARGIN = 10;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

const RADIUS_MAP: Record<string, number> = {
  'Local (5km)': 5,
  'City (15km)': 15,
  'Regional (50km)': 50,
};

const radiusOptions = Object.keys(RADIUS_MAP);

// Custom dark map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#2f3948" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];

export default function JobDiscoveryScreen() {
  const [activeRadius, setActiveRadius] = useState(radiusOptions[0]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchJobs();
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setUserCoords(coords);
      } catch (error) {
        console.warn("Could not fetch location", error);
        fetchJobs();
      }
    })();
  }, []);

  useEffect(() => {
    if (userCoords !== null || !loading) {
      fetchJobs();
    }
  }, [activeRadius, userCoords]);

  const fetchJobs = async () => {
    try {
      const radiusKm = RADIUS_MAP[activeRadius];
      let queryParams = new URLSearchParams();

      if (userCoords) {
        queryParams.append('lat', userCoords.lat.toString());
        queryParams.append('lng', userCoords.lng.toString());
        queryParams.append('max_distance_km', radiusKm.toString());
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

  const onMarkerPress = (index: number) => {
    setSelectedJobIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
    
    const job = jobs[index];
    if (job.location?.coordinates) {
      mapRef.current?.animateToRegion({
        latitude: job.location.coordinates[1],
        longitude: job.location.coordinates[0],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / FULL_CARD_WIDTH);
    if (index !== selectedJobIndex && index >= 0 && index < jobs.length) {
      setSelectedJobIndex(index);
      const job = jobs[index];
      if (job.location?.coordinates) {
        mapRef.current?.animateToRegion({
          latitude: job.location.coordinates[1],
          longitude: job.location.coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    }
  };

  const renderJobCard = ({ item, index }: { item: any; index: number }) => {
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
              <Text style={styles.infoText}>₹{item.pay_rate?.toLocaleString()}/mo</Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={16} color="#000666" />
              <Text style={styles.infoText}>{item.distance_km || '2.4'} km away</Text>
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
      
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.headerButton}>
          <Menu color="#000666" size={24} />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Job Discovery</Text>
        {/* <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/(worker)/(tabs)/feed')}>
          <List color="#000666" size={24} />
        </TouchableOpacity> */}
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
initialRegion={{
          latitude: userCoords?.lat || 17.3850,
          longitude: userCoords?.lng || 78.4867,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {userCoords && (
          <>
            <Marker
              coordinate={{ latitude: userCoords.lat, longitude: userCoords.lng }}
              title="You are here"
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

        {jobs.map((job, index) => (
          job.location?.coordinates && (
            <Marker
              key={job._id}
              coordinate={{
                latitude: job.location.coordinates[1],
                longitude: job.location.coordinates[0],
              }}
              onPress={() => onMarkerPress(index)}
            >
              <View style={[
                styles.jobMarker,
                selectedJobIndex === index && styles.jobMarkerSelected
              ]}>
                <View style={[
                  styles.jobMarkerBubble,
                  selectedJobIndex === index && styles.jobMarkerBubbleSelected
                ]}>
                  <Text style={[
                    styles.jobMarkerText,
                    selectedJobIndex === index && styles.jobMarkerTextSelected
                  ]}>₹{Math.round(job.pay_rate/1000)}k/m</Text>
                </View>
                <View style={[
                  styles.jobMarkerIconContainer,
                  selectedJobIndex === index && styles.jobMarkerIconContainerSelected
                ]}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/706/706164.png' }} 
                    style={[styles.jobMarkerIcon, selectedJobIndex === index && { tintColor: '#fff' }]} 
                  />
                </View>
              </View>
            </Marker>
          )
        ))}
      </MapView>

      {/* Radius Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterInner}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setActiveRadius(option)}
                style={[
                  styles.filterChip,
                  activeRadius === option ? styles.filterChipActive : styles.filterChipInactive
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  activeRadius === option ? styles.filterChipTextActive : styles.filterChipTextInactive
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Job Cards */}
      <View style={styles.cardsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000666" />
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
  headerButton: {
    padding: 0,
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
  jobMarker: {
    alignItems: 'center',
  },
  jobMarkerBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 5,
  },
  jobMarkerBubbleSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  jobMarkerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  jobMarkerTextSelected: {
    color: '#fff',
  },
  jobMarkerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobMarkerIconContainerSelected: {
    backgroundColor: '#f97316',
  },
  jobMarkerIcon: {
    width: 18,
    height: 18,
  },
  jobMarkerSelected: {
    zIndex: 10,
  }
});
