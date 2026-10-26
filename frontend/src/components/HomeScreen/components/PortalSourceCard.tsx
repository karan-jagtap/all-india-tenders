import React from 'react';
import { Card, Badge, Title, Text, Group, Stack, Anchor, Button, Box } from '@mantine/core';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { PortalSourceInfo } from '../../../constants/portalSources';

export interface PortalSourceCardProps {
  portal: PortalSourceInfo;
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const PortalSourceCard: React.FC<PortalSourceCardProps> = ({ portal, onNavigate }) => {
  return (
    <Card
      p="md"
      radius="lg"
      withBorder
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease',
      }}
      className="hover-card-cyan"
    >
      <Stack gap="xs">
        {/* Header: Portal Name & Domain */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Badge size="xs" variant="light" color="cyan" radius="sm">
              {portal.domain}
            </Badge>
            <Title order={4} size="sm" mt={6} style={{ color: 'var(--color-text-main)', fontWeight: 700, lineHeight: 1.3 }}>
              {portal.name}
            </Title>
          </Box>

          <Badge size="xs" variant="light" color="teal" radius="sm" leftSection={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}>
            LIVE
          </Badge>
        </Group>

        {/* State, Region & Category */}
        <Group gap={6} style={{ fontSize: '11px', color: 'var(--color-text-dimmed)' }}>
          <Text size="11px" fw={600} style={{ color: 'var(--color-text-sub)' }}>{portal.state}</Text>
          <span>•</span>
          <Text size="11px" style={{ color: 'var(--color-text-dimmed)' }}>{portal.region}</Text>
          <span>•</span>
          <Text size="11px" fw={600} c="cyan">{portal.category}</Text>
        </Group>

        {/* Description */}
        <Text size="xs" lineClamp={2} style={{ color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
          {portal.description}
        </Text>

        {/* Key Authorities Covered */}
        <Box>
          <Text size="10px" fw={700} tt="uppercase" style={{ color: 'var(--color-text-dimmed)', marginBottom: 4 }}>
            Procuring Authorities:
          </Text>
          <Group gap={4} wrap="wrap">
            {portal.keyAuthorities.slice(0, 4).map((auth) => (
              <Badge key={auth} size="xs" variant="outline" color="gray" radius="sm" styles={{ root: { textTransform: 'none' } }}>
                {auth}
              </Badge>
            ))}
            {portal.keyAuthorities.length > 4 && (
              <Text size="10px" c="dimmed">
                +{portal.keyAuthorities.length - 4} more
              </Text>
            )}
          </Group>
        </Box>

        {/* Statutory Framework */}
        <Text size="10px" ff="monospace" pt={6} style={{ color: 'var(--color-text-dimmed)', borderTop: '1px solid var(--color-border-subtle)' }}>
          🛡️ {portal.statutoryFramework}
        </Text>
      </Stack>

      {/* Card Footer: Visit Portal & Filter by Source button */}
      <Group justify="space-between" align="center" pt="xs" mt="xs" style={{ borderTop: '1px solid var(--color-border)' }}>
        <Anchor
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          size="xs"
          fw={700}
          c="cyan"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          <span>Visit Portal</span>
          <ExternalLink className="w-3 h-3" />
        </Anchor>

        <Button
          variant="subtle"
          color="orange"
          size="compact-xs"
          rightSection={<ChevronRight className="w-3 h-3" />}
          onClick={() => onNavigate('current')}
          styles={{ root: { fontWeight: 700 } }}
        >
          View Tenders
        </Button>
      </Group>
    </Card>
  );
};
