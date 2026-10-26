import React from 'react';
import {
  Modal,
  Badge,
  Button,
  Group,
  Text,
  Title,
  Box,
  ActionIcon,
  Anchor,
} from '@mantine/core';
import {
  BookOpen,
  Download,
  ExternalLink,
  X,
  Building2,
  ShieldCheck,
  Layers,
  Clock
} from 'lucide-react';
import { EnrichedCurrentTender } from '../../types';
import { formatINR } from '../../utils';

export interface WholeTenderDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: EnrichedCurrentTender | null;
  sbdUrl: string;
}

export const WholeTenderDocModal: React.FC<WholeTenderDocModalProps> = ({
  isOpen,
  onClose,
  tender,
  sbdUrl
}) => {
  if (!tender) return null;

  const downloadFileName = `${tender.id}_Whole_Tender_Document_SBD.pdf`;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="92%"
      radius="xl"
      withCloseButton={false}
      padding={0}
      styles={{
        content: {
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        },
        body: {
          padding: 0,
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        {/* Top Header */}
        <Group justify="space-between" align="center" px="md" py="sm" style={{ backgroundColor: '#070a10', color: '#ffffff', borderBottom: '1px solid #1e293b' }}>
          <Group gap="sm" align="flex-start" style={{ flex: 1, minWidth: 0 }}>
            <Box
              p={8}
              style={{
                borderRadius: 12,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                color: '#a5b4fc',
              }}
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </Box>

            <Box style={{ flex: 1, minWidth: 0 }}>
              <Group gap="xs" mb={4} wrap="wrap">
                <Badge color="teal" size="xs" radius="xl" style={{ textTransform: 'uppercase' }}>
                  Whole Tender Document (SBD / RFP)
                </Badge>
                <Badge variant="outline" color="gray" size="xs" radius="sm" ff="monospace">
                  Ref: {tender.nit_number}
                </Badge>
                <Badge color="indigo" variant="light" size="xs" radius="sm">
                  48 Pages • 3.8 MB PDF
                </Badge>
                <Badge color="cyan" variant="light" size="xs" radius="sm">
                  {tender.source_portal}
                </Badge>
              </Group>

              <Title order={4} size="sm" lineClamp={1} style={{ color: '#ffffff', fontWeight: 700 }}>
                {tender.title}
              </Title>

              <Group gap="xs" mt={4} style={{ fontSize: '11px', color: '#94a3b8' }} wrap="wrap">
                <Group gap={4}>
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <Text size="11px" style={{ color: '#cbd5e1' }}>{tender.organization}</Text>
                </Group>
                <span>•</span>
                <Text size="11px" fw={700} ff="monospace" c="yellow">
                  Est. {tender.estimated_cost_inr ? formatINR(tender.estimated_cost_inr) : 'Refer to Notice'}
                </Text>
                <span>•</span>
                <Group gap={4}>
                  <Clock className="w-3 h-3 text-rose-400" />
                  <Text size="11px" c="red" ff="monospace">Closes: {tender.closing_date}</Text>
                </Group>
              </Group>
            </Box>
          </Group>

          {/* Action Buttons: Prominent Download, Open in Tab, Close */}
          <Group gap="xs" wrap="nowrap">
            <Anchor
              href={sbdUrl}
              download={downloadFileName}
              style={{ textDecoration: 'none' }}
            >
              <Button
                color="teal"
                size="xs"
                radius="md"
                leftSection={<Download className="w-4 h-4" />}
                rightSection={<Badge size="xs" color="teal" variant="filled">3.8 MB</Badge>}
                styles={{ root: { fontWeight: 700 } }}
              >
                Download Whole Doc (PDF)
              </Button>
            </Anchor>

            <Anchor
              href={sbdUrl}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="default"
                size="xs"
                radius="md"
                leftSection={<ExternalLink className="w-3.5 h-3.5" />}
              >
                New Tab
              </Button>
            </Anchor>

            <ActionIcon variant="subtle" color="gray" size="lg" radius="md" onClick={onClose} aria-label="Close viewer">
              <X className="w-5 h-5 text-white" />
            </ActionIcon>
          </Group>
        </Group>

        {/* Volume & Section Navigation Strip */}
        <Group gap="xs" px="md" py={6} style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', overflowX: 'auto' }} wrap="nowrap">
          <Group gap={4} style={{ flexShrink: 0 }}>
            <Layers className="w-3 h-3 text-indigo-500" />
            <Text size="11px" fw={700} c="dimmed">Included Volumes:</Text>
          </Group>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol I: Instructions to Bidders (ITB)</Badge>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol II: Pre-Qualification Criteria (PQC)</Badge>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol III: Contract Conditions (GCC & SCC)</Badge>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol IV: Technical Specs (BIS/IRC)</Badge>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol V: BOQ Rate Schedule</Badge>
          <Badge size="xs" variant="outline" color="gray" radius="sm">Vol VI: Statutory Undertakings (GFR 175)</Badge>
        </Group>

        {/* Embedded Interactive PDF Viewer */}
        <Box style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#1e293b' }}>
          <iframe
            src={sbdUrl}
            title={`Whole Tender Document Preview - ${tender.nit_number}`}
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </Box>

        {/* Modal Footer */}
        <Group justify="space-between" px="md" py="xs" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <Group gap="xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <Text size="11px" c="dimmed">
              Complete statutory Standard Bidding Document (SBD) streamed directly in-memory via ReportLab under GFR 2017 & CVC guidelines.
            </Text>
          </Group>

          <Group gap="xs">
            <Anchor href={sbdUrl} download={downloadFileName} style={{ textDecoration: 'none' }}>
              <Button color="teal" size="xs" radius="md" leftSection={<Download className="w-3.5 h-3.5" />}>
                Download PDF
              </Button>
            </Anchor>
            <Button variant="default" size="xs" radius="md" onClick={onClose}>
              Close Viewer
            </Button>
          </Group>
        </Group>
      </div>
    </Modal>
  );
};
