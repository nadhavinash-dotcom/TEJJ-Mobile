export type VoiceStepType = 'role' | 'sub_skill' | 'location' | 'availability';

export type StepOption = {
  id: string;
  label: string;
  aliases?: string[];
};

export type VoiceSuggestion = {
  id: string;
  label: string;
  nativeLabel: string;
  confidence: number;
};

export type VoiceMatchResult =
  | { type: 'options'; items: VoiceSuggestion[]; multiSelect: boolean }
  | { type: 'availability'; days: VoiceSuggestion[]; shifts: VoiceSuggestion[] }
  | { type: 'no_match' };
