import { SKILL_LIST } from '@/utils';
import { LucideIcon } from './LucideIcon';
import { TouchableOpacity, View, Text } from 'react-native';

interface SkillGridProps {
  selected?: string;
  onSelect: (skillId: string) => void;
  multiSelect?: boolean;
  selectedList?: string[];
  onMultiSelect?: (skills: string[]) => void;
}

export function SkillGrid({ selected, onSelect, multiSelect, selectedList = [], onMultiSelect }: SkillGridProps) {
  const handlePress = (id: string) => {
    if (multiSelect && onMultiSelect) {
      if (selectedList.includes(id)) {
        onMultiSelect(selectedList.filter((s) => s !== id));
      } else {
        onMultiSelect([...selectedList, id]);
      }
    } else {
      onSelect(id);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2 px-4 pt-6">
      {SKILL_LIST.map((skill) => {
        const isSelected = multiSelect ? selectedList.includes(skill.id) : selected === skill.id;
        return (
          <TouchableOpacity
            key={skill.id}
            onPress={() => handlePress(skill.id)}
            className={`items-center justify-center rounded-2xl border w-[22%] py-3 ${isSelected
              ? 'bg-amber-500 border-amber-500'
              : 'bg-white text-black border-zinc-700'
              }`}
            activeOpacity={0.7}
          >
            <View className="mb-2">
              <LucideIcon 
                name={skill.icon} 
                size={22} 
                color={isSelected ? '#FFFFFF' : '#94A3B8'} 
              />
            </View>
            <Text className={`text-[10px] text-center font-medium ${isSelected ? 'text-white' : 'text-[#94A3B8]'}`} numberOfLines={1}>
              {skill.label}
            </Text>
            {isSelected && (
              <View className="absolute top-1 right-1">
                <LucideIcon name="CheckCircle" size={10} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
