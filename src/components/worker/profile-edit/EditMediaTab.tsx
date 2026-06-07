import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AIScoreBar } from '@/src/components/worker/AIScoreBar';
import { LucideIcon } from '@/src/components/shared/LucideIcon';
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

  const photoToDisplay = draft.profile_photo_uri
    ? { uri: draft.profile_photo_uri }
    : draft.profile_photo_url
    ? { uri: getAbsoluteUrl(draft.profile_photo_url) }
    : null;

  const hasVideo = !!draft.skill_video_uri || !!draft.skill_video_url;
  const videoUri = draft.skill_video_uri || (draft.skill_video_url ? getAbsoluteUrl(draft.skill_video_url) : null);
  const player = useVideoPlayer(videoUri, (p) => { p.loop = true; });

  return (
    <View style={styles.container}>

      {/* Profile Photo */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PROFILE PHOTO</Text>
        <View style={styles.photoRow}>
          {photoToDisplay ? (
            <Image source={photoToDisplay} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <LucideIcon name="User" size={40} color="#C6C5D4" />
            </View>
          )}
          <View style={styles.photoInfo}>
            <Text style={styles.photoHint}>
              Use a clear, well-lit face photo.{'\n'}Square crops work best.
            </Text>
            <TouchableOpacity onPress={pickImage} style={styles.outlineBtn} activeOpacity={0.75}>
              <LucideIcon name="Camera" size={15} color="#000666" />
              <Text style={styles.outlineBtnText}>
                {photoToDisplay ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Skill Video */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SKILL VIDEO</Text>
        <Text style={styles.sectionHint}>
          A 30–60 sec clip of you at work dramatically boosts your profile visibility.
        </Text>

        {hasVideo ? (
          <View style={styles.videoCard}>
            {videoUri && (
              <View style={styles.videoPlayer}>
                <VideoView
                  player={player}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  allowsFullscreen
                />
              </View>
            )}
            <View style={styles.videoCardFooter}>
              <View style={styles.videoStatus}>
                <LucideIcon name="CheckCircle" size={16} color="#16A34A" />
                <Text style={styles.videoStatusText}>Video uploaded</Text>
              </View>
              {draft.ai_score && <AIScoreBar scores={draft.ai_score} />}
            </View>
          </View>
        ) : (
          <View style={styles.videoEmpty}>
            <LucideIcon name="Video" size={32} color="#C6C5D4" />
            <Text style={styles.videoEmptyTitle}>No skill video yet</Text>
            <Text style={styles.videoEmptyHint}>Upload a clip to get AI-scored and stand out</Text>
          </View>
        )}

        <TouchableOpacity onPress={pickVideo} style={styles.outlineBtn} activeOpacity={0.75}>
          <LucideIcon name="Upload" size={15} color="#000666" />
          <Text style={styles.outlineBtnText}>
            {hasVideo ? 'Replace Video' : 'Upload Video'}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionHint: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    marginTop: -4,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#BDC2FF',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F6F2F8',
    borderWidth: 2,
    borderColor: '#E4E1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInfo: {
    flex: 1,
    gap: 10,
  },
  photoHint: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BDC2FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  outlineBtnText: {
    color: '#000666',
    fontSize: 14,
    fontWeight: '600',
  },
  videoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    marginBottom: 12,
  },
  videoPlayer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
  },
  videoCardFooter: {
    padding: 14,
    gap: 10,
  },
  videoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoStatusText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '600',
  },
  videoEmpty: {
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  videoEmptyTitle: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '600',
  },
  videoEmptyHint: {
    color: '#C6C5D4',
    fontSize: 12,
    textAlign: 'center',
  },
});
