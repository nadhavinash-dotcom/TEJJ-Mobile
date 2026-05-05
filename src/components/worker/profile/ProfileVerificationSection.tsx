// Verification & Trust section of the Worker Profile screen
import React from 'react';
import { ShieldCheck, Zap, Eye } from 'lucide-react-native';
import { ProfileColors as C } from './ProfileColors';
import { SectionCard, InfoRow } from './ProfilePrimitives';

interface ProfileVerificationSectionProps {
  isVerified: boolean;
  aiScore: string | null;
  aiScoreStatus: string;
  status: string;
}

export function ProfileVerificationSection({
  isVerified, aiScore, aiScoreStatus, status,
}: ProfileVerificationSectionProps) {
  return (
    <SectionCard title="Verification & Trust">
      <InfoRow
        icon={<ShieldCheck size={14} color={isVerified ? C.green : C.outline} />}
        label="Aadhaar"
        value={isVerified ? 'Verified ✓' : 'Not verified'}
        color={isVerified ? C.green : C.outline}
      />
      {aiScore && (
        <InfoRow
          icon={<Zap size={14} color={C.amber} />}
          label="AI Score Status"
          value={aiScoreStatus}
        />
      )}
      <InfoRow
        icon={<Eye size={14} color={C.onSurfaceVariant} />}
        label="Profile Visibility"
        value={status === 'ACTIVE' ? 'Visible to employers' : 'Not visible'}
        color={status === 'ACTIVE' ? C.green : C.outline}
      />
    </SectionCard>
  );
}
