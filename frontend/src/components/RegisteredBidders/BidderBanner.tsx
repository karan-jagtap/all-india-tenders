import React from 'react';
import { Paper, Title, Text, Badge, Group, Stack, SimpleGrid, Box } from '@mantine/core';
import { ShieldCheck } from 'lucide-react';

export interface BidderBannerProps {
  totalBidders: number;
  totalContractsSum: number;
  totalValueSumCr: string;
}

export const BidderBanner: React.FC<BidderBannerProps> = ({
  totalBidders,
  totalContractsSum,
  totalValueSumCr
}) => {
  return (
    <Paper
      p={{ base: 'md', sm: 'xl' }}
      radius="xl"
      withBorder
      style={{
        background: 'linear-gradient(135deg, #070a10 0%, #0c1527 50%, #070a10 100%)',
        borderColor: '#1e293b',
        color: '#ffffff',
      }}
    >
      <Group justify="space-between" align="center" gap="lg" wrap="wrap">
        <Stack gap="xs" style={{ maxWidth: 720 }}>
          <Group gap="xs" wrap="wrap">
            <Badge color="blue" size="sm" radius="xl" leftSection={<ShieldCheck className="w-3.5 h-3.5" />}>
              VERIFIED BIDDERS DIRECTORY • GFR 2017
            </Badge>
            <Badge variant="outline" color="gray" size="xs" radius="sm" ff="monospace">
              100% In-Memory RAM Streaming
            </Badge>
            <Text size="xs" c="cyan" ff="monospace">
              Across 42 Real Government Portals
            </Text>
          </Group>

          <Title order={2} size="h4" style={{ color: '#ffffff', fontWeight: 800 }}>
            Registered Indian Contractors & Bidder Intelligence Directory
          </Title>

          <Text size="xs" style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
            Complete corporate dossiers, verified statutory classifications (Super Class-I, Class-I A), audited annual turnover, banker solvency capacity, and comprehensive portfolios of public contracts won till date.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs" style={{ flexShrink: 0 }}>
          <Box p="sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 10, border: '1px solid #334155', textAlign: 'center' }}>
            <Text size="10px" tt="uppercase" fw={600} c="dimmed">Registered Bidders</Text>
            <Text size="md" fw={700} c="blue" ff="monospace">{totalBidders} Contractors</Text>
          </Box>
          <Box p="sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 10, border: '1px solid #334155', textAlign: 'center' }}>
            <Text size="10px" tt="uppercase" fw={600} c="dimmed">Contracts Won</Text>
            <Text size="md" fw={700} c="teal" ff="monospace">{totalContractsSum} Awards</Text>
          </Box>
          <Box p="sm" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 10, border: '1px solid #334155', textAlign: 'center' }}>
            <Text size="10px" tt="uppercase" fw={600} c="dimmed">Total Value</Text>
            <Text size="md" fw={700} c="yellow" ff="monospace">₹ {Number(totalValueSumCr).toLocaleString('en-IN')} Cr</Text>
          </Box>
        </SimpleGrid>
      </Group>
    </Paper>
  );
};
