import React from 'react';
import { SimpleGrid, Paper, Text, Group, Box } from '@mantine/core';
import { Radio, TrendingDown, Award, Users, Globe, Database, ChevronRight } from 'lucide-react';

export interface HomeMetricsBarProps {
  activeTenders: number;
  totalValueCr: string;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onScrollToSources: () => void;
}

export const HomeMetricsBar: React.FC<HomeMetricsBarProps> = ({
  activeTenders,
  totalValueCr,
  acceptedTenders,
  biddersCount,
  onNavigate,
  onScrollToSources
}) => {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="sm">
      {/* Metric 1: Live Notices */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        onClick={() => onNavigate('current')}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        className="hover-card-orange"
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Live Notices
          </Text>
          <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          {activeTenders.toLocaleString()}
        </Text>
        <Group gap={4} mt={4}>
          <Text size="xs" fw={600} c="orange">In-Progress Unfilled</Text>
          <ChevronRight className="w-3 h-3 text-orange-500" />
        </Group>
      </Paper>

      {/* Metric 2: Pipeline Value */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Pipeline Value
          </Text>
          <TrendingDown className="w-4 h-4 text-emerald-500" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          ₹ {totalValueCr} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Cr</span>
        </Text>
        <Box mt={4}>
          <Text size="xs" fw={600} c="teal">Estimated Cost Total</Text>
        </Box>
      </Paper>

      {/* Metric 3: Awarded Bids */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        onClick={() => onNavigate('accepted')}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        className="hover-card-teal"
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Awarded Bids
          </Text>
          <Award className="w-4 h-4 text-emerald-500" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          {acceptedTenders.toLocaleString()}
        </Text>
        <Group gap={4} mt={4}>
          <Text size="xs" fw={600} c="teal">17-Yr Historical Archive</Text>
          <ChevronRight className="w-3 h-3 text-emerald-500" />
        </Group>
      </Paper>

      {/* Metric 4: Registered Contractors */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        onClick={() => onNavigate('bidders')}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        className="hover-card-blue"
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Contractors
          </Text>
          <Users className="w-4 h-4 text-blue-500" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          {biddersCount}
        </Text>
        <Group gap={4} mt={4}>
          <Text size="xs" fw={600} c="blue">EPC & Infra Profiles</Text>
          <ChevronRight className="w-3 h-3 text-blue-500" />
        </Group>
      </Paper>

      {/* Metric 5: Real Portals */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        onClick={onScrollToSources}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        className="hover-card-cyan"
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Real Portals
          </Text>
          <Globe className="w-4 h-4 text-cyan-500" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          28+ <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Sources</span>
        </Text>
        <Group gap={4} mt={4}>
          <Text size="xs" fw={600} c="cyan">51 Endpoints Monitored</Text>
          <ChevronRight className="w-3 h-3 text-cyan-500" />
        </Group>
      </Paper>

      {/* Metric 6: Architecture */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <Group justify="space-between" mb={4}>
          <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: '0.05em', color: 'var(--color-text-dimmed)' }}>
            Architecture
          </Text>
          <Database className="w-4 h-4 text-purple-500" />
        </Group>
        <Text fz={{ base: 'xl', sm: '1.6rem' }} fw={900} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
          SQLite + Vector
        </Text>
        <Box mt={4}>
          <Text size="xs" fw={600} c="grape" ff="monospace">Persistent + In-Memory</Text>
        </Box>
      </Paper>
    </SimpleGrid>
  );
};
