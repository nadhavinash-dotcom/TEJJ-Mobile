import { useState, useCallback, useRef } from 'react';
import { SpeechResult } from './useSpeechToText';
import { VoiceStepType, StepOption, VoiceMatchResult } from '../types/voice';
import { matchVoiceToStep } from '../services/voiceStepMatcher';

export function useVoiceStep(stepType: VoiceStepType, getOptions: () => StepOption[]) {
  const [match, setMatch] = useState<VoiceMatchResult | null>(null);
  const [speechResult, setSpeechResult] = useState<SpeechResult | null>(null);

  const getOptionsRef = useRef(getOptions);
  getOptionsRef.current = getOptions;

  const handleVoiceResult = useCallback(
    (result: SpeechResult): 'pending' => {
      const options = getOptionsRef.current();
      console.log(`[useVoiceStep:${stepType}] handleVoiceResult — englishText: "${result.englishText}" | originalText: "${result.originalText}" | options count: ${options.length}`);
      setSpeechResult(result);
      matchVoiceToStep(result, stepType, options).then((m) => {
        console.log(`[useVoiceStep:${stepType}] matchVoiceToStep resolved:`, JSON.stringify(m));
        setMatch(m);
      });
      return 'pending';
    },
    [stepType],
  );

  const dismiss = useCallback(() => {
    console.log(`[useVoiceStep:${stepType}] dismiss — clearing match & speechResult`);
    setMatch(null);
    setSpeechResult(null);
  }, [stepType]);

  return { handleVoiceResult, match, speechResult, dismiss };
}
