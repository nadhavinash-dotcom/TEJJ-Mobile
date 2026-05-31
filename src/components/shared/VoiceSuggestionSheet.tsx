import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { VoiceMatchResult, VoiceSuggestion } from '../../types/voice';
import { SpeechResult } from '../../hooks/useSpeechToText';
import { LucideIcon } from './LucideIcon';

interface VoiceSuggestionSheetProps {
  match: VoiceMatchResult | null;
  speechResult: SpeechResult | null;
  multiSelect?: boolean;
  onConfirm: (selected: VoiceSuggestion[]) => void;
  onClose: () => void;
}

function SuggestionCard({
  item,
  selected,
  onToggle,
  showBestMatch,
}: {
  item: VoiceSuggestion;
  selected: boolean;
  onToggle: () => void;
  showBestMatch: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: selected ? '#F59E0B' : '#3F3F46',
        backgroundColor: selected ? 'rgba(245,158,11,0.15)' : '#27272A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <Text style={{ color: selected ? '#F59E0B' : '#fff', fontSize: 15, fontWeight: '600' }}>
            {item.label}
          </Text>
          {showBestMatch && (
            <View style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ color: '#22C55E', fontSize: 11, fontWeight: '600' }}>Best match</Text>
            </View>
          )}
        </View>
        {item.nativeLabel && item.nativeLabel !== item.label && (
          <Text style={{ color: '#71717A', fontSize: 13 }}>"{item.nativeLabel}"</Text>
        )}
      </View>
      {selected && <LucideIcon name="Check" size={18} color="#F59E0B" />}
    </TouchableOpacity>
  );
}

export function VoiceSuggestionSheet({
  match,
  speechResult,
  multiSelect = false,
  onConfirm,
  onClose,
}: VoiceSuggestionSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const visible = match !== null && match.type !== 'no_match';

  // Auto-select high-confidence items when sheet opens
  useEffect(() => {
    if (!visible || !match) {
      setSelectedIds(new Set());
      return;
    }
    if (match.type === 'options') {
      const highConf = match.items.filter((s) => s.confidence >= 0.8);
      const toSelect = multiSelect ? highConf : highConf.length > 0 ? [highConf[0]] : [];
      setSelectedIds(new Set(toSelect.map((s) => s.id)));
    } else if (match.type === 'availability') {
      const autoD = match.days.filter((s) => s.confidence >= 0.8).map((s) => s.id);
      const autoS = match.shifts.filter((s) => s.confidence >= 0.8).map((s) => s.id);
      setSelectedIds(new Set([...autoD, ...autoS]));
    }
  }, [visible, match, multiSelect]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiSelect && match?.type === 'options') next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (!match) return;
    if (match.type === 'options') {
      const selected = match.items.filter((s) => selectedIds.has(s.id));
      // If nothing manually selected, use top item
      onConfirm(selected.length > 0 ? selected : match.items.slice(0, 1));
    } else if (match.type === 'availability') {
      const allItems = [...match.days, ...match.shifts];
      onConfirm(allItems.filter((s) => selectedIds.has(s.id)));
    }
  };

  const confirmCount = selectedIds.size;
  const canConfirm = confirmCount > 0 || (match?.type === 'options' && (match.items.length > 0));

  if (!match || match.type === 'no_match') return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#18181B',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 40,
            maxHeight: '85%',
          }}
        >
          {/* Drag handle */}
          <View style={{ width: 40, height: 4, backgroundColor: '#3F3F46', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>What did you mean?</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <LucideIcon name="X" size={22} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* Speech info bubble */}
          {speechResult && (
            <View style={{ backgroundColor: '#27272A', borderRadius: 12, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: '#A1A1AA', fontSize: 11, marginBottom: 2 }}>YOU SAID</Text>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{speechResult.originalText}</Text>
              {speechResult.englishText && speechResult.englishText !== speechResult.originalText && (
                <>
                  <Text style={{ color: '#A1A1AA', fontSize: 11, marginTop: 8, marginBottom: 2 }}>TRANSLATED</Text>
                  <Text style={{ color: '#F59E0B', fontSize: 14 }}>{speechResult.englishText}</Text>
                </>
              )}
            </View>
          )}

          <Text style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>
            {match.type === 'availability'
              ? 'Select the days and shifts you meant:'
              : multiSelect
              ? 'Select all that apply:'
              : 'Select the best match:'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
            {match.type === 'options' && (
              <View style={{ marginBottom: 8 }}>
                {match.items.map((item, i) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onToggle={() => toggle(item.id)}
                    showBestMatch={i === 0 && item.confidence >= 0.8}
                  />
                ))}
              </View>
            )}

            {match.type === 'availability' && (
              <>
                {match.days.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#A1A1AA', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>
                      DAYS
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {match.days.map((item) => {
                        const sel = selectedIds.has(item.id);
                        return (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => toggle(item.id)}
                            activeOpacity={0.75}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 10,
                              borderRadius: 12,
                              borderWidth: 1.5,
                              borderColor: sel ? '#F59E0B' : '#3F3F46',
                              backgroundColor: sel ? 'rgba(245,158,11,0.15)' : '#27272A',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            {sel && <LucideIcon name="Check" size={13} color="#F59E0B" />}
                            <Text style={{ color: sel ? '#F59E0B' : '#D4D4D8', fontSize: 14, fontWeight: '600' }}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
                {match.shifts.length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#A1A1AA', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 }}>
                      SHIFTS
                    </Text>
                    {match.shifts.map((item) => {
                      const sel = selectedIds.has(item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => toggle(item.id)}
                          activeOpacity={0.75}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 12,
                            borderWidth: 1.5,
                            borderColor: sel ? '#F59E0B' : '#3F3F46',
                            backgroundColor: sel ? 'rgba(245,158,11,0.15)' : '#27272A',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ color: sel ? '#F59E0B' : '#D4D4D8', fontSize: 14, fontWeight: '600' }}>
                              {item.label}
                            </Text>
                            {item.nativeLabel && item.nativeLabel !== item.label && (
                              <Text style={{ color: '#71717A', fontSize: 12 }}>"{item.nativeLabel}"</Text>
                            )}
                          </View>
                          {sel && <LucideIcon name="Check" size={16} color="#F59E0B" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: '#27272A', alignItems: 'center' }}
            >
              <Text style={{ color: '#A1A1AA', fontWeight: '600', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                flex: 2,
                paddingVertical: 14,
                borderRadius: 16,
                backgroundColor: canConfirm ? '#F59E0B' : '#3F3F46',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: canConfirm ? '#fff' : '#71717A', fontWeight: '700', fontSize: 15 }}>
                {confirmCount > 0 ? `Apply (${confirmCount})` : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
