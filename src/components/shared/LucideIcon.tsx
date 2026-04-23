import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { LucideProps } from 'lucide-react-native';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends LucideProps {
  name: string;
}

export const LucideIcon = ({ name, color = '#FFFFFF', size = 24, ...props }: IconProps) => {
  const IconComponent = (LucideIcons as any)[name];
  
  if (!IconComponent) {
    // Return a fallback icon if the name is not found
    return <LucideIcons.HelpCircle color={color} size={size} {...props} />;
  }

  return <IconComponent color={color} size={size} {...props} />;
};
