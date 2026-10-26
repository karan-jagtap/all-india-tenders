import React from 'react';
import { Paper, Title, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { Radio, Award, Users, Globe, ArrowRight } from 'lucide-react';

export interface HomeHeroSectionProps {
  activeTenders: number;
  acceptedTenders: number;
  biddersCount: number;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onScrollToSources: () => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  activeTenders,
  acceptedTenders,
  biddersCount,
  onNavigate,
  onScrollToSources
}) => {
  return (
    <Paper
      p={{ base: 'lg', sm: 'xl' }}
      radius="xl"
      withBorder
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #070a10 0%, #0e1422 50%, #070a10 100%)',
        borderColor: '#1e293b',
        color: '#ffffff',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Decorative background glow accents */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          marginRight: '-5rem',
          marginTop: '-5rem',
          width: '20rem',
          height: '20rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(234, 88, 12, 0.15)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          marginLeft: '-5rem',
          marginBottom: '-5rem',
          width: '20rem',
          height: '20rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      <Stack gap="md" style={{ position: 'relative', zIndex: 10, maxWidth: 900 }}>
        {/* National Tricolor Badge */}
        <Group gap="xs">
          <Badge
            size="lg"
            radius="xl"
            variant="outline"
            styles={{
              root: {
                backgroundColor: 'rgba(30, 41, 59, 0.85)',
                borderColor: '#334155',
                color: '#e2e8f0',
                textTransform: 'none',
                fontWeight: 600,
                padding: '6px 14px',
                height: 'auto',
              }
            }}
          >
            <span style={{ fontSize: '1rem', marginRight: 6 }}>🇮🇳</span>
            <span style={{ color: '#fb923c', fontWeight: 700 }}>National Public Procurement Platform</span>
            <span style={{ margin: '0 6px', color: '#64748b' }}>•</span>
            <span style={{ color: '#34d399', fontFamily: 'monospace' }}>Hybrid Persistent DB + Vector Ready</span>
          </Badge>
        </Group>

        {/* Headline */}
        <Title
          order={1}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          Autonomous Tender Intelligence Across{' '}
          <span
            style={{
              background: 'linear-gradient(to right, #fb923c, #fcd34d, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            India's Official Procurement Portals
          </span>
        </Title>

        {/* Subtitle */}
        <Text size="sm" style={{ color: '#cbd5e1', lineHeight: 1.6, maxWidth: 760 }}>
          Real-time statutory procurement intelligence platform aggregating unfilled in-progress tenders, complete 48-page Standard Bidding Documents (SBD / RFP), 17-year awarded bid records (2010 – 2026), and contractor intelligence from <strong>28+ official Central and State government portals</strong> — powered by an <strong>Enterprise Hybrid Persistent Database Architecture</strong>.
        </Text>

        {/* CTA Action Buttons */}
        <Group gap="sm" pt="xs" wrap="wrap">
          <Button
            color="orange"
            size="md"
            radius="md"
            leftSection={<Radio className="w-4 h-4 animate-pulse" />}
            rightSection={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('current')}
            styles={{
              root: {
                fontWeight: 800,
                boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.35)',
              }
            }}
          >
            Explore In-Progress Tenders ({activeTenders.toLocaleString()})
          </Button>

          <Button
            color="teal"
            size="md"
            radius="md"
            leftSection={<Award className="w-4 h-4 text-emerald-300" />}
            onClick={() => onNavigate('accepted')}
            styles={{
              root: {
                fontWeight: 800,
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.35)',
              }
            }}
          >
            Awarded Bids Archive ({acceptedTenders.toLocaleString()})
          </Button>

          <Button
            variant="default"
            size="md"
            radius="md"
            leftSection={<Users className="w-4 h-4 text-blue-400" />}
            onClick={() => onNavigate('bidders')}
            styles={{
              root: {
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                color: '#f1f5f9',
                fontWeight: 700,
              }
            }}
          >
            Registered Contractors ({biddersCount})
          </Button>

          <Button
            variant="subtle"
            size="md"
            radius="md"
            leftSection={<Globe className="w-4 h-4 text-cyan-400" />}
            onClick={onScrollToSources}
            styles={{
              root: {
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                color: '#cbd5e1',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1e293b',
                }
              }
            }}
          >
            View 28+ Real Sourced Portals
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
