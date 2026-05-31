import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LucideIcon } from './LucideIcon';
import { VoiceModal } from './VoiceModal';
import { SpeechResult } from '../../hooks/useSpeechToText';

interface VoiceMicButtonProps {
  onResult: (params: SpeechResult) => boolean | 'pending' | void;
  disabled?: boolean;
}

export function VoiceMicButton({ onResult, disabled }: VoiceMicButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        disabled={disabled}
        className="flex-row items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10"
        activeOpacity={0.75}
      >
        <LucideIcon name="Mic" size={18} color="#F59E0B" />
        <Text className="text-amber-400 text-sm">Speak now</Text>
      </TouchableOpacity>

      {/* Mount only when open — ensures fresh hook state each session */}
      {open && (
        <VoiceModal
          visible={open}
          onResult={onResult}
          onClose={() => setOpen(false)}
        />
      )}
    </View>
  );
}
