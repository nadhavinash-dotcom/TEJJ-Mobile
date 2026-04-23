import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';

interface TrustGaugeProps {
  score: number;
  size?: number;
}

export function TrustGauge({ score, size = 200 }: TrustGaugeProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const progress = Math.min(Math.max(score / 5.0, 0), 1);
  const needleAngle = startAngle + progress * totalAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (from: number, to: number, r: number, color: string) => {
    const fx = center + r * Math.cos(toRad(from));
    const fy = center + r * Math.sin(toRad(from));
    const tx = center + r * Math.cos(toRad(to));
    const ty = center + r * Math.sin(toRad(to));
    const large = to - from > 180 ? 1 : 0;
    return <Path d={`M ${fx} ${fy} A ${r} ${r} 0 ${large} 1 ${tx} ${ty}`} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />;
  };

  const needleX = center + radius * Math.cos(toRad(needleAngle));
  const needleY = center + radius * Math.sin(toRad(needleAngle));

  const gaugeColor = score < 2.5 ? '#EF4444' : score < 3.5 ? '#F59E0B' : '#22C55E';

  return (
    <View className="items-center">
      <Svg width={size} height={size * 0.7}>
        <G>
          {arcPath(-210, -130, radius, '#374151')}
          {arcPath(-130, -50, radius, '#374151')}
          {arcPath(-50, 30, radius, '#374151')}
          {arcPath(-210, needleAngle, radius, gaugeColor)}
          <Circle cx={center} cy={center} r={8} fill={gaugeColor} />
          <Path
            d={`M ${center} ${center} L ${needleX} ${needleY}`}
            stroke={gaugeColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Text className="text-white text-4xl font-bold -mt-8">{score.toFixed(1)}</Text>
      <Text className="text-navy-300 text-sm">{score >= 4.0 ? 'Excellent' : score >= 3.0 ? 'Good' : 'Needs Work'}</Text>
    </View>
  );
}
