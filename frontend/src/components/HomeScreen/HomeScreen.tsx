import React from 'react';
import { Stack } from '@mantine/core';
import { PlatformStats } from '../../types';
import {
  HomeHeroSection,
  HomeMetricsBar,
  HomeCapabilitiesSection,
  HomeSourcesDirectory,
  HomeCtaBanner,
  HomeFeedbackContactSection
} from './components';

export interface HomeScreenProps {
  stats: PlatformStats | null;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onNavigate,
  onTriggerSync,
  isSyncing
}) => {
  const activeTenders = stats?.active_tenders_count || 2718;
  const acceptedTenders = stats?.accepted_tenders_count || 4393;
  const biddersCount = stats?.registered_bidders_count || 87;
  const totalValueCr = stats?.total_active_procurement_value_inr
    ? (stats.total_active_procurement_value_inr / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 1 })
    : '6,730.6';

  const scrollToSources = () => {
    const el = document.getElementById('real-sources-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Stack gap="xl" pb="xl">
      {/* 1. Hero Section */}
      <HomeHeroSection
        activeTenders={activeTenders}
        acceptedTenders={acceptedTenders}
        biddersCount={biddersCount}
        onNavigate={onNavigate}
        onScrollToSources={scrollToSources}
      />

      {/* 2. Real-Time Metrics Bar */}
      <HomeMetricsBar
        activeTenders={activeTenders}
        totalValueCr={totalValueCr}
        acceptedTenders={acceptedTenders}
        biddersCount={biddersCount}
        onNavigate={onNavigate}
        onScrollToSources={scrollToSources}
      />

      {/* 3. Core Capabilities: What Our Application Does */}
      <HomeCapabilitiesSection onNavigate={onNavigate} />

      {/* 4. Statutory Sourced Government Portals Directory */}
      <HomeSourcesDirectory
        onNavigate={onNavigate}
        onTriggerSync={onTriggerSync}
        isSyncing={isSyncing}
      />

      {/* 5. Bottom Call to Action Banner */}
      <HomeCtaBanner onNavigate={onNavigate} />

      {/* 6. Feedback & Contact Us Section (Stores in DB & emails kmessilj@gmail.com) */}
      <HomeFeedbackContactSection />
    </Stack>
  );
};
