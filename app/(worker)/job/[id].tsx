import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';
import api from '../../../src/lib/api';

import { JobDetailHeader } from '../../../src/components/worker/job-detail/JobDetailHeader';
import { SpotsUrgencyBanner } from '../../../src/components/worker/job-detail/SpotsUrgencyBanner';
import { JobExpiryBanner } from '../../../src/components/worker/job-detail/JobExpiryBanner';
import { JobShiftSection } from '../../../src/components/worker/job-detail/JobShiftSection';
import { JobPerksRow } from '../../../src/components/worker/job-detail/JobPerksRow';
import { JobDescriptionSection } from '../../../src/components/worker/job-detail/JobDescriptionSection';
import { EmployerCard } from '../../../src/components/worker/job-detail/EmployerCard';
import { JobApplyCTA } from '../../../src/components/worker/job-detail/JobApplyCTA';
import { C } from '../../../src/components/worker/job-detail/colors';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [applying, setApplying] = useState(false);
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return res.data.data;
    },
  });

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await api.post('/applications', { job_id: id });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      router.replace({ pathname: '/(worker)/applied/[id]', params: { id: res.data.data._id } });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading || !job) {
    return (
      <SafeScreen style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeScreen>
    );
  }

  const spotsLeft = job.number_of_openings - job.openings_filled;

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Back */}
        <View className="px-4 pt-5 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 self-start">
            <ChevronLeft size={20} color={C.primary} />
            <Text style={{ color: C.primary, fontSize: 15, fontWeight: '500' }}>Back</Text>
          </TouchableOpacity>
        </View>

        <JobDetailHeader job={job} />

        <SpotsUrgencyBanner spotsLeft={spotsLeft} />

        <JobExpiryBanner
          expires_at={job.expires_at}
          lane={job.lane}
          status={job.status}
          contract_start_date={job.contract_start_date}
          contract_duration={job.contract_duration}
        />

        <JobShiftSection
          lane={job.lane}
          shift_start_time={job.shift_start_time}
          shift_end_time={job.shift_end_time}
          shift_duration_hours={job.shift_duration_hours}
          number_of_openings={job.number_of_openings}
          openings_filled={job.openings_filled}
          experience_years_min={job.experience_years_min}
          minimum_qualification={job.minimum_qualification}
          contract_start_date={job.contract_start_date}
          contract_duration={job.contract_duration}
          notice_period_max_days={job.notice_period_max_days}
          interview_required={job.interview_required}
          interview_format={job.interview_format}
        />

        <JobPerksRow
          meals_provided={job.meals_provided}
          accommodation_provided={job.accommodation_provided}
          transport_provided={job.transport_provided}
          uniform_provided={job.uniform_provided}
          uniform_details={job.uniform_details}
        />

        <JobDescriptionSection
          description={job.description}
          secondary_skills_preferred={job.secondary_skills_preferred}
          cuisine_preferred={job.cuisine_preferred}
          special_instructions={job.special_instructions}
        />

        <EmployerCard
          employer_property_name={job.employer_property_name}
          employer_property_type={job.employer_property_type}
          employer_property_segment={job.employer_property_segment}
          employer_area_locality={job.employer_area_locality}
          employer_city={job.employer_city}
          employer_location_landmark={job.employer_location_landmark}
          employer_nearest_metro={job.employer_nearest_metro}
          employer_parking_available={job.employer_parking_available}
          employer_cuisine_types={job.employer_cuisine_types}
          employer_covers_capacity={job.employer_covers_capacity}
          employer_number_of_rooms={job.employer_number_of_rooms}
          employer_brand_affiliation={job.employer_brand_affiliation}
          employer_year_established={job.employer_year_established}
          employer_dignity_score={job.employer_dignity_score}
          employer_dignity_state={job.employer_dignity_state}
          employer_gstin_verified={job.employer_gstin_verified}
          employer_fssai_verified={job.employer_fssai_verified}
          employer_liquor_license={job.employer_liquor_license}
          employer_psara_registered={job.employer_psara_registered}
          employer_verified_badge={job.employer_verified_badge}
          employer_confirmation_rate={job.employer_confirmation_rate}
          employer_pay_accuracy_rate={job.employer_pay_accuracy_rate}
          employer_fair_treatment_rate={job.employer_fair_treatment_rate}
          employer_worker_return_rate={job.employer_worker_return_rate}
          employer_total_confirmed_arrivals={job.employer_total_confirmed_arrivals}
        />
      </ScrollView>

      <JobApplyCTA
        status={job.status}
        has_applied={job.has_applied}
        application_id={job.application_id}
        applying={applying}
        onApply={handleApply}
      />
    </SafeScreen>
  );
}
