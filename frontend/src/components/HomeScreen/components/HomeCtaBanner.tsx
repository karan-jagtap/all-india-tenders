import React from 'react';
import { Paper, Title, Text, Button, Group, Stack } from '@mantine/core';
import { Radio, Award, Users } from 'lucide-react';

export interface HomeCtaBannerProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const HomeCtaBanner: React.FC<HomeCtaBannerProps> = ({ onNavigate }) => {
  return (
    <Paper
      p={{ base: 'md', sm: 'xl' }}
      radius="xl"
      withBorder
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Group justify="space-between" align="center" gap="lg" wrap="wrap">
        <Stack gap={4} style={{ maxWidth: 620 }}>
          <Title order={3} size="h4" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
            Ready to explore India's public procurement tenders?
          </Title>
          <Text size="xs" style={{ color: 'var(--color-text-muted)' }}>
            Choose a section to inspect live statutory notices, search 17-year awarded bid archives (2010 – 2026), or evaluate registered infrastructure contractors.
          </Text>
        </Stack>

        <Group gap="sm" wrap="wrap">
          <Button
            color="orange"
            radius="md"
            size="sm"
            leftSection={<Radio className="w-3.5 h-3.5 animate-pulse" />}
            onClick={() => onNavigate('current')}
            styles={{
              root: { fontWeight: 700 }
            }}
          >
            InProgress Tenders
          </Button>

          <Button
            color="teal"
            radius="md"
            size="sm"
            leftSection={<Award className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('accepted')}
            styles={{
              root: { fontWeight: 700 }
            }}
          >
            Awarded Archive
          </Button>

          <Button
            color="blue"
            radius="md"
            size="sm"
            leftSection={<Users className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('bidders')}
            styles={{
              root: { fontWeight: 700 }
            }}
          >
            Registered Contractors
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};
