import { SKILL_LIST, SKILL_CATEGORIES } from '@/utils';
import { LucideIcon } from './LucideIcon';
import { TouchableOpacity, View, Text } from 'react-native';

type Skill = (typeof SKILL_LIST)[number];

interface SkillGridProps {
  selected?: string;
  onSelect: (skillId: string) => void;
  multiSelect?: boolean;
  selectedList?: string[];
  onMultiSelect?: (skills: string[]) => void;
  /** Restrict the grid to a single sector. */
  category?: string;
  /** Render sector headers + grouping (used when no `category` filter). */
  grouped?: boolean;
}

export function SkillGrid({
  selected,
  onSelect,
  multiSelect,
  selectedList = [],
  onMultiSelect,
  category,
  grouped,
}: SkillGridProps) {
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

  const renderTile = (skill: Skill) => {
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
  };

  // Grouped view: one section per sector with a header.
  if (grouped && !category) {
    return (
      <View className="px-4 pt-4">
        {SKILL_CATEGORIES.map((cat) => {
          const skills = SKILL_LIST.filter((s) => s.category === cat.id);
          if (skills.length === 0) return null;
          return (
            <View key={cat.id} className="mb-6">
              <View className="flex-row items-center gap-2 mb-3 px-1">
                <LucideIcon name={cat.icon} size={16} color="#000666" />
                <Text className="text-on-surface text-sm font-bold">{cat.label}</Text>
                <Text className="text-on-surface-variant text-xs">({skills.length})</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {skills.map(renderTile)}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // Filtered / flat view.
  const list = category ? SKILL_LIST.filter((s) => s.category === category) : SKILL_LIST;
  return (
    <View className="flex-row flex-wrap gap-2 px-4 pt-6">
      {list.map(renderTile)}
    </View>
  );
}
