import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LucideIcon } from './LucideIcon';

interface OnboardingFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  color?: string;
  backDisabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const COLOR_MAP: Record<string, string> = {
  'bg-blue-600': '#2563EB',
  'bg-amber-500': '#000666',
  'bg-green-600': '#16A34A',
  'bg-teal-600': '#0D9488',
  'bg-indigo-600': '#4F46E5',
};

function AnimatedBtn({
  onPress,
  disabled,
  style,
  children,
}: {
  onPress: () => void;
  disabled?: boolean;
  style: object | object[];
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.95, { damping: 20, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 380 });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[anim, ...(Array.isArray(style) ? style : [style])]}
    >
      {children}
    </AnimatedPressable>
  );
}

export function OnboardingFooter({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = 'Next',
  color = '#000666',
  backDisabled = false,
}: OnboardingFooterProps) {
  const btnColor = color.startsWith('#') ? color : (COLOR_MAP[color] || '#000666');
  const label = nextLabel.replace(' →', '');

  return (
    <View style={styles.container}>
      <AnimatedBtn
        onPress={onBack}
        disabled={backDisabled}
        style={[styles.backBtn, backDisabled && styles.dimmed]}
      >
        <LucideIcon name="ChevronLeft" size={18} color={backDisabled ? '#C6C5D4' : '#767683'} />
        <Text style={[styles.backText, backDisabled && styles.dimText]}>Back</Text>
      </AnimatedBtn>

      <AnimatedBtn
        onPress={onNext}
        disabled={nextDisabled}
        style={[
          styles.nextBtn,
          nextDisabled
            ? styles.nextBtnDisabled
            : { backgroundColor: btnColor },
        ]}
      >
        <Text style={[styles.nextText, nextDisabled && styles.dimText]}>{label}</Text>
        <LucideIcon name="ArrowRight" size={18} color={nextDisabled ? '#C6C5D4' : '#FFFFFF'} />
      </AnimatedBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E1E7',
    backgroundColor: '#FFFFFF',
  },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnDisabled: {
    backgroundColor: '#F0EDF2',
    borderWidth: 1,
    borderColor: '#E4E1E7',
  },
  backText: { color: '#767683', fontWeight: '600', fontSize: 15 },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  dimmed: { opacity: 0.5 },
  dimText: { color: '#C6C5D4' },
});
