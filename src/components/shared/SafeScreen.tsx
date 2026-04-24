import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeScreenProps extends ViewProps {
  children: React.ReactNode;
  bgClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function SafeScreen({ 
  children, 
  bgClassName = 'bg-navy-900', 
  edges = ['top', 'bottom'],
  className = '',
  style,
  ...props 
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  return (
    <View 
      className={`flex-1 ${bgClassName} ${className}`}
      style={[
        {
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
