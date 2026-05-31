import api from '../lib/api';
import { VoiceStepType, StepOption, VoiceMatchResult, VoiceSuggestion } from '../types/voice';
import { SpeechResult } from '../hooks/useSpeechToText';

// ─── Client-side fallback matching ───────────────────────────────────────────

const DAY_ALIASES: Record<string, string> = {
  mon: 'Mon', monday: 'Mon',
  tue: 'Tue', tuesday: 'Tue',
  wed: 'Wed', wednesday: 'Wed',
  thu: 'Thu', thursday: 'Thu',
  fri: 'Fri', friday: 'Fri',
  sat: 'Sat', saturday: 'Sat',
  sun: 'Sun', sunday: 'Sun',
  // Hindi transliterations
  somvar: 'Mon', mangalvar: 'Tue', budhvar: 'Wed',
  guruvar: 'Thu', brihaspativar: 'Thu',
  shukravar: 'Fri', shanivar: 'Sat', ravivar: 'Sun',
};

const SHIFT_ALIASES: { id: string; label: string; aliases: string[] }[] = [
  { id: 'morning', label: 'Morning', aliases: ['morning', 'dawn', 'early', 'breakfast', 'subah', 'prabhat'] },
  { id: 'afternoon', label: 'Afternoon', aliases: ['afternoon', 'midday', 'noon', 'lunch', 'dopahar', 'din'] },
  { id: 'evening', label: 'Evening', aliases: ['evening', 'shaam', 'dusk', 'dinner', 'sandhya'] },
  { id: 'night', label: 'Night', aliases: ['night', 'raat', 'late', 'midnight', 'nisha'] },
];

function scoreOption(text: string, opt: StepOption): number {
  let score = 0;
  const lower = text.toLowerCase();
  if (lower.includes(opt.label.toLowerCase())) score += 1.0;
  if (opt.aliases) {
    for (const alias of opt.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        score += 0.8;
        break;
      }
    }
  }
  return score;
}

function clientMatchOptions(
  result: SpeechResult,
  options: StepOption[],
  multiSelect: boolean,
): VoiceMatchResult {
  // Try translated text first, fall back to original if translation same as original
  const searchText = result.englishText || result.originalText;

  const scored = options
    .map((opt) => ({ opt, score: scoreOption(searchText, opt) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return { type: 'no_match' };

  const maxScore = scored[0].score;
  const items: VoiceSuggestion[] = scored.map(({ opt, score }) => ({
    id: opt.id,
    label: opt.label,
    nativeLabel: result.originalText,
    confidence: Math.min(score / maxScore, 1),
  }));

  return { type: 'options', items, multiSelect };
}

function clientMatchAvailability(result: SpeechResult): VoiceMatchResult {
  const text = (result.englishText || result.originalText).toLowerCase();

  const matchedDayIds = new Set<string>();
  for (const [alias, dayId] of Object.entries(DAY_ALIASES)) {
    if (text.includes(alias)) matchedDayIds.add(dayId);
  }

  // Range: "monday to friday" / "mon-fri"
  const rangeMatch = text.match(/(\w+)\s*(?:to|-)\s*(\w+)/);
  if (rangeMatch) {
    const from = DAY_ALIASES[rangeMatch[1]];
    const to = DAY_ALIASES[rangeMatch[2]];
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (from && to) {
      const fi = allDays.indexOf(from);
      const ti = allDays.indexOf(to);
      if (fi !== -1 && ti !== -1 && fi <= ti) {
        for (let i = fi; i <= ti; i++) matchedDayIds.add(allDays[i]);
      }
    }
  }

  const matchedShifts: VoiceSuggestion[] = [];
  for (const shift of SHIFT_ALIASES) {
    for (const alias of shift.aliases) {
      if (text.includes(alias)) {
        matchedShifts.push({
          id: shift.id,
          label: shift.label,
          nativeLabel: result.originalText,
          confidence: 0.85,
        });
        break;
      }
    }
  }

  const days: VoiceSuggestion[] = Array.from(matchedDayIds).map((d) => ({
    id: d,
    label: d,
    nativeLabel: result.originalText,
    confidence: 0.9,
  }));

  if (days.length === 0 && matchedShifts.length === 0) return { type: 'no_match' };

  return { type: 'availability', days, shifts: matchedShifts };
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function matchVoiceToStep(
  result: SpeechResult,
  stepType: VoiceStepType,
  options?: StepOption[],
): Promise<VoiceMatchResult> {
  console.log(`[voiceStepMatcher] matchVoiceToStep — stepType: ${stepType} | searchText: "${result.englishText || result.originalText}" | options: ${options?.length ?? 0}`);

  // Try backend first
  try {
    console.log('[voiceStepMatcher] calling /voice/match-step ...');
    const res = await api.post('/voice/match-step', {
      originalText: result.originalText,
      translatedText: result.englishText,
      stepType,
      options,
    });
    console.log('[voiceStepMatcher] /voice/match-step response:', JSON.stringify(res.data));
    if (res.data.success) {
      return res.data.data as VoiceMatchResult;
    }
    console.warn('[voiceStepMatcher] /voice/match-step returned success:false — falling back');
  } catch (err: any) {
    console.warn('[voiceStepMatcher] /voice/match-step failed:', err?.response?.status, err?.message, '— using client-side fallback');
  }

  // Client-side fallback: keyword matching against provided options
  if (stepType === 'availability') {
    const r = clientMatchAvailability(result);
    console.log('[voiceStepMatcher] client fallback (availability):', JSON.stringify(r));
    return r;
  }

  if (options && options.length > 0) {
    const r = clientMatchOptions(result, options, stepType === 'sub_skill');
    console.log('[voiceStepMatcher] client fallback (options):', JSON.stringify(r));
    return r;
  }

  console.warn('[voiceStepMatcher] no_match — no options provided and stepType not handled');
  return { type: 'no_match' };
}
