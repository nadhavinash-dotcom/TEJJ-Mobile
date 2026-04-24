import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../src/lib/firebase';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/lib/api';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);
  const { verificationId, setUser, clear } = useAuthStore();

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6 || !verificationId) return;
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      const token = await result.user.getIdToken();
      
      // Register or login the user on the backend
      await api.post('/auth/register', { firebase_token: token });
      
      // Fetch the full user object
      const meRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const user = meRes.data.data;

      console.log('User:', user);

      setUser({
        userId: user._id,
        firebaseUid: result.user.uid,
        hasWorker: user.has_worker,
        hasEmployer: user.has_employer,
        activeRole: user.active_role,
      });
      if (!user.active_role) {
        router.replace('/(auth)/role');
      } else if (user.active_role === 'employer') {
        if(user.hasEmployer) {
          router.replace('/(employer)/(tabs)/dashboard');
        } else {
          router.replace('/(employer)/onboarding/property');
        }
      } else {
        if(user.hasWorker) {
          router.replace('/(worker)/(tabs)/feed');
        } else {
          router.replace('/(worker)/onboarding/role');
        }
      }
    } catch (e: any) {
      console.error('OTP Verification Error:', e);
      let errorMessage = 'The code you entered is incorrect. Please try again.';
      if (e.response && e.response.data && e.response.data.error) {
        errorMessage = e.response.data.error;
      } else if (e.message) {
        errorMessage = e.message;
      }
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-amber-400 text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2">Enter OTP</Text>
        <Text className="text-navy-300 text-sm mb-8">Sent to {phone}</Text>

        <View className="flex-row justify-between mb-8">
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => { if (r) inputs.current[idx] = r; }}
              value={digit}
              onChangeText={(v) => handleChange(v, idx)}
              keyboardType="number-pad"
              maxLength={1}
              className={`w-12 h-14 text-white text-xl text-center rounded-xl border ${digit ? 'border-amber-500 bg-amber-500/10' : 'border-navy-600 bg-navy-800'}`}
              autoFocus={idx === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading || otp.join('').length < 6}
          className={`rounded-2xl py-4 items-center mb-4 ${loading || otp.join('').length < 6 ? 'bg-navy-700' : 'bg-amber-500'}`}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Verify & Continue →</Text>}
        </TouchableOpacity>

        <TouchableOpacity disabled={resendTimer > 0} className="items-center py-2">
          <Text className={`text-sm ${resendTimer > 0 ? 'text-navy-500' : 'text-amber-400'}`}>
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
