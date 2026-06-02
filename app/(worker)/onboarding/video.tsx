import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function VideoScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const [uploading, setUploading] = useState(false);

  // Camera & Recording State
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const player = useVideoPlayer(worker.skill_video_uri || null, p => {
    p.loop = true;
    p.play();
  });

  // Timer effect for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 90) {
            stopRecording();
            return 90;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    try {
      const data = await cameraRef.current.recordAsync({
        maxDuration: 90,
      });
      if (data && data.uri) {
        updateWorker({ skill_video_uri: data.uri });
      }
    } catch (error) {
      console.error("Failed to record video:", error);
      Alert.alert("Error", "Failed to record video. Please try again.");
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        updateWorker({ skill_video_uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick a video from gallery.");
    }
  };

  const handleDiscard = () => {
    Alert.alert('Discard Video', 'Are you sure you want to discard this video?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => {
        updateWorker({ skill_video_uri: '', ai_score: undefined });
      }},
    ]);
  };

  // If permissions are still loading or not granted yet
  if (!cameraPermission || !micPermission) {
    return <SafeScreen className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#000666" /></SafeScreen>;
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <SafeScreen className="flex-1 justify-center items-center px-6">
        <View style={{ backgroundColor: '#FFFFFF', padding: 32, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E4E1E7', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
          <View style={{ backgroundColor: '#E0E0FF', padding: 20, borderRadius: 24, marginBottom: 20 }}>
            <LucideIcon name="Video" size={48} color="#000666" />
          </View>
          <Text className="text-on-surface text-2xl font-bold text-center mb-3">Camera & Mic Needed</Text>
          <Text className="text-on-surface-variant text-center mb-8 leading-relaxed">
            We need access to your camera and microphone to record your skill verification video.
          </Text>
          <TouchableOpacity
            onPress={() => {
              requestCameraPermission();
              requestMicPermission();
            }}
            style={{ backgroundColor: '#000666', width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1 px-6 pt-8 pb-10" showsVerticalScrollIndicator={false}>
        <StepIndicator currentStep={9} totalSteps={11} />

        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-on-surface text-3xl font-bold mb-1">Record Skill{'\n'}Verification</Text>
          <Text className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Show your skills in action. Introduce yourself and demonstrate a basic task in under 90 seconds.
          </Text>

          <View style={{ backgroundColor: '#F6F2F8', borderWidth: 1, borderColor: '#E4E1E7', borderRadius: 20, padding: 18, gap: 12 }}>
            <View className="flex-row items-start gap-3">
              <LucideIcon name="CheckCircle2" color="#16A34A" size={18} />
              <Text className="text-on-surface-variant text-sm flex-1">Keep the background clean and quiet.</Text>
            </View>
            <View className="flex-row items-start gap-3">
              <LucideIcon name="CheckCircle2" color="#16A34A" size={18} />
              <Text className="text-on-surface-variant text-sm flex-1">Wear your professional uniform if available.</Text>
            </View>
          </View>
        </View>

        {/* Video Area */}
        <View className="h-[450px] relative w-full bg-black rounded-[40px] overflow-hidden border-4 border-zinc-900 mb-8 shadow-2xl">
          {worker.skill_video_uri ? (
            // PREVIEW MODE
            <>
              <VideoView
                player={player}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                contentFit="cover"
                allowsFullscreen
              />
              <View className="absolute top-6 inset-x-6 px-4 py-3 bg-black/60 rounded-2xl flex-row items-center justify-center gap-2 border border-white/10">
                <LucideIcon name="CheckCircle2" color="#10B981" size={20} />
                <Text className="text-white font-bold text-base">Video Ready</Text>
              </View>
            </>
          ) : (
            // CAMERA MODE
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
              mode="video"
            >
              <View className="absolute inset-0 bg-black/10" />

              {/* Countdown Timer */}
              <View className="absolute top-6 right-6 px-4 py-2 bg-black/40 rounded-full border border-white/20 flex-row items-center gap-2 z-20">
                <View className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
                <Text className="text-white font-mono font-bold text-xl tracking-widest">
                  {formatTime(isRecording ? recordingDuration : 90)}
                </Text>
              </View>

              {/* Record Button Overlay */}
              <View className="absolute inset-x-0 bottom-10 flex-col items-center gap-6 z-20">
                {!isRecording && (
                  <View className="bg-black/40 px-6 py-2 rounded-full border border-white/10">
                    <Text className="text-white font-semibold text-sm">Center yourself in frame</Text>
                  </View>
                )}

                <View className="relative items-center justify-center">
                  <View className="absolute w-24 h-24 rounded-full border-4 border-white/30" />
                  <TouchableOpacity
                    onPress={isRecording ? stopRecording : startRecording}
                    className="w-18 h-18 bg-red-600 rounded-full items-center justify-center active:scale-95 shadow-2xl"
                  >
                    {isRecording ? (
                      <LucideIcon name="Square" color="white" fill="white" size={24} />
                    ) : (
                      <View className="w-7 h-7 bg-white rounded-full" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Framing Guides */}
              <View className="absolute inset-0 pointer-events-none opacity-20 z-10">
                <View className="absolute top-1/3 w-full h-[0.5px] bg-white" />
                <View className="absolute top-2/3 w-full h-[0.5px] bg-white" />
                <View className="absolute left-1/3 h-full w-[0.5px] bg-white" />
                <View className="absolute right-1/3 h-full w-[0.5px] bg-white" />
              </View>
            </CameraView>
          )}

          {/* Loading Overlay */}
          {uploading && (
            <View className="absolute inset-0 items-center justify-center bg-black/80 z-30">
              <ActivityIndicator color="#F59E0B" size="large" />
              <Text className="text-amber-400 font-bold text-lg mt-6 text-center px-8">
                Saving Video...
              </Text>
            </View>
          )}
        </View>

        {/* AI Score Display */}
        {worker.ai_score && !uploading && (
          <View style={{ marginBottom: 32, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E4E1E7', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
            <View className="flex-row items-center gap-3 mb-4">
              <View style={{ backgroundColor: '#E0E0FF', padding: 8, borderRadius: 12 }}>
                <LucideIcon name="Sparkles" size={20} color="#000666" />
              </View>
              <Text className="text-on-surface text-xl font-bold">AI Skill Analysis</Text>
            </View>
            <AIScoreBar scores={worker.ai_score} />
          </View>
        )}

        {/* Secondary Controls */}
        <View className="flex-row gap-4 mb-10">
          {worker.skill_video_uri ? (
            <>
              <TouchableOpacity
                onPress={handleDiscard}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' }}
                activeOpacity={0.7}
              >
                <LucideIcon name="Trash2" color="#EF4444" size={20} />
                <Text style={{ fontWeight: '700', color: '#EF4444' }}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickVideo}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E1E7' }}
                activeOpacity={0.7}
              >
                <LucideIcon name="Upload" color="#000666" size={20} />
                <Text style={{ fontWeight: '700', color: '#1B1B1F' }}>Upload New</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={pickVideo}
                disabled={isRecording}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E1E7', opacity: isRecording ? 0.5 : 1 }}
                activeOpacity={0.7}
              >
                <LucideIcon name="Upload" color="#000666" size={20} />
                <Text style={{ fontWeight: '700', color: '#1B1B1F' }}>Upload File</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleCameraFacing}
                disabled={isRecording}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E1E7', opacity: isRecording ? 0.5 : 1 }}
                activeOpacity={0.7}
              >
                <LucideIcon name="SwitchCamera" color="#000666" size={20} />
                <Text style={{ fontWeight: '700', color: '#1B1B1F' }}>Flip Cam</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/notifications')}
          nextLabel={worker.skill_video_uri ? 'Next →' : 'Skip for now →'}
          nextDisabled={uploading || isRecording}
        />
        
        <View className="h-10" />
      </ScrollView>
    </SafeScreen>
  );
}
