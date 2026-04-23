import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled, loading, className, icon }: ButtonProps) {
  const base = 'rounded-2xl flex-row items-center justify-center';

  const variants = {
    primary: 'bg-amber-500',
    secondary: 'bg-navy-800 border border-navy-600',
    danger: 'bg-red-600',
    ghost: 'bg-transparent',
  };

  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textColors = {
    primary: 'text-white font-bold',
    secondary: 'text-white',
    danger: 'text-white font-bold',
    ghost: 'text-amber-500',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40' : ''} ${className || ''}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#F59E0B' : '#fff'} size="small" />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textColors[variant]} ${textSizes[size]}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
