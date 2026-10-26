import React from 'react';
import {
  Modal,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  ActionIcon,
  Anchor,
  Code,
  Alert,
} from '@mantine/core';
import { Globe, X, Building2, CheckCircle, Copy, Check, ShieldAlert, Search } from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';

export interface PortalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  copiedNit: string | null;
  onCopyNit: (nit: string) => void;
}

export const PortalBridgeModal: React.FC<PortalBridgeModalProps> = ({
  isOpen,
  onClose,
  tender,
  copiedNit,
  onCopyNit
}) => {
  if (!tender) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="lg"
      radius="xl"
      withCloseButton={false}
      padding="xl"
      styles={{
        content: {
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }
      }}
    >
      <Stack gap="md">
        {/* Modal Header */}
        <Group justify="space-between" align="flex-start" pb="xs" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Group gap="sm">
            <Paper
              p={8}
              radius="md"
              withBorder
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
              }}
            >
              <Globe className="w-5 h-5" />
            </Paper>
            <div>
              <Title order={3} size="h5" style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>
                Official Portal Direct Bridge
              </Title>
              <Text size="xs" c="dimmed">
                {tender.source_portal}
              </Text>
            </div>
          </Group>

          <ActionIcon variant="subtle" color="gray" size="md" radius="md" onClick={onClose} aria-label="Close bridge">
            <X className="w-4 h-4" />
          </ActionIcon>
        </Group>

        {/* Tender Info */}
        <Paper
          p="sm"
          radius="md"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            borderColor: 'var(--color-border)',
          }}
        >
          <Group gap={6} mb={4}>
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <Text size="11px" fw={600} style={{ color: 'var(--color-text-sub)' }}>{tender.organization}</Text>
          </Group>
          <Text size="xs" fw={700} lineClamp={2} style={{ color: 'var(--color-text-main)' }}>
            {tender.title}
          </Text>
        </Paper>

        {/* NIT Copy Box */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
          }}
        >
          <Group justify="space-between" mb="xs">
            <Group gap={6}>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <Text size="xs" fw={700} c="teal">
                Tender Reference ID (Copied to Clipboard!)
              </Text>
            </Group>
            <Badge size="xs" color="teal" variant="light" radius="xl">
              Ready to Paste
            </Badge>
          </Group>

          <Group justify="space-between" p="xs" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <Code fw={700} style={{ fontSize: '0.8rem', userSelect: 'all' }}>
              {tender.nit_number}
            </Code>
            <Button
              color="teal"
              size="compact-xs"
              radius="sm"
              onClick={() => onCopyNit(tender.nit_number)}
              leftSection={copiedNit === tender.nit_number ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            >
              {copiedNit === tender.nit_number ? 'Copied!' : 'Copy Again'}
            </Button>
          </Group>
        </Paper>

        {/* Explanation Alert */}
        <Alert
          icon={<ShieldAlert className="w-4 h-4" />}
          color="blue"
          radius="md"
          title="Why doesn't the portal open the tender in 1 click?"
        >
          <Text size="11px" style={{ lineHeight: 1.5 }}>
            National procurement portals (CPPP, MahaTenders, defproc, etc.) are protected by government anti-scraping firewalls. They do not permit direct unauthenticated deep-links and mandate entering the Tender ID + captcha.
          </Text>
          <Text size="11px" fw={600} mt={6}>
            ⚡ How to view instantly: Click the gateway button below &rarr; Paste (<kbd>Ctrl+V</kbd> / <kbd>Cmd+V</kbd>) into Tender ID &rarr; Search.
          </Text>
        </Alert>

        {/* Action Buttons */}
        <Group justify="flex-end" pt="xs">
          <Button variant="subtle" color="gray" size="xs" onClick={onClose}>
            Close
          </Button>

          <Anchor
            href={tender.portal_url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="default"
              size="xs"
              radius="md"
              leftSection={<Building2 className="w-3.5 h-3.5 text-slate-400" />}
            >
              2. Open Org Directory ↗
            </Button>
          </Anchor>

          <Anchor
            href={tender.portal_search_url || tender.portal_url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button
              color="blue"
              size="xs"
              radius="md"
              leftSection={<Search className="w-3.5 h-3.5" />}
              styles={{ root: { fontWeight: 700 } }}
            >
              1. Open Official Search Gateway ↗
            </Button>
          </Anchor>
        </Group>
      </Stack>
    </Modal>
  );
};
