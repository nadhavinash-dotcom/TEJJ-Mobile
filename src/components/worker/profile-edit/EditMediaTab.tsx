import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AIScoreBar } from '@/src/components/worker/AIScoreBar';
import { getAbsoluteUrl } from '@/utils';

interface EditMediaTabProps {
  draft: any;
  updateDraft: (updates: any) => void;
}

export function EditMediaTab({ draft, updateDraft }: EditMediaTabProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets?.[0]) {
      updateDraft({ profile_photo_uri: result.assets[0].uri });
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      updateDraft({ skill_video_uri: result.assets[0].uri });
    }
  };

  // Determine what to display for photo
  const photoToDisplay = draft.profile_photo_uri 
    ? { uri: draft.profile_photo_uri } 
    : draft.profile_photo_url 
      ? { uri: getAbsoluteUrl(draft.profile_photo_url) } 
      : null;

  // Determine what to display for video indicator
  const hasVideo = !!draft.skill_video_uri || !!draft.skill_video_url;
  const videoUri = draft.skill_video_uri || (draft.skill_video_url ? getAbsoluteUrl(draft.skill_video_url) : null);
  const player = useVideoPlayer(videoUri, p => {
    p.loop = true;
  });

  return (
    <View className="px-6 py-4 gap-8 mb-6">
      <View>
        <Text className="text-white text-lg font-bold mb-4">Profile Photo</Text>
        <View className="items-center">
          {photoToDisplay ? (
            <Image source={photoToDisplay} className="w-32 h-32 rounded-full border-4 border-amber-500 mb-4" />
          ) : (
            <View className="w-32 h-32 rounded-full bg-navy-800 border-4 border-navy-600 items-center justify-center mb-4">
              <Text className="text-4xl">👤</Text>
            </View>
          )}
          <TouchableOpacity onPress={pickImage} className="bg-navy-800 border border-amber-500/40 rounded-xl px-6 py-3">
            <Text className="text-amber-400 font-semibold">Change Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className="text-white text-lg font-bold mb-4">Skill Video</Text>
        {hasVideo ? (
          <View className="bg-navy-800 rounded-2xl border border-navy-600 mb-4 overflow-hidden">
            {videoUri && (
              <View className="w-full h-64 bg-black">
                <VideoView 
                  player={player} 
                  style={{ width: '100%', height: '100%' }} 
                  contentFit="cover" 
                  allowsFullscreen 
                />
              </View>
            )}
            <View className="p-4 border-t border-navy-600">
              <Text className="text-green-400 font-bold mb-2">✓ Video Uploaded</Text>
              {draft.ai_score && <AIScoreBar scores={draft.ai_score} />}
            </View>
          </View>
        ) : (
          <View className="bg-navy-800 p-4 rounded-2xl border border-navy-700 mb-4 items-center">
            <Text className="text-navy-400 mb-2">No video uploaded yet</Text>
          </View>
        )}
        <TouchableOpacity onPress={pickVideo} className="bg-navy-800 border border-amber-500/40 rounded-xl py-3 items-center">
          <Text className="text-amber-400 font-semibold">{hasVideo ? 'Replace Video' : 'Upload Video'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
