import React from 'react';
import { Card, Badge, Title, Text, Group, SimpleGrid, Box } from '@mantine/core';
import { MapPin, ChevronRight } from 'lucide-react';
import { RegisteredBidder } from '../../types';
import { formatCr } from '../../utils';

export interface BidderCardProps {
  bidder: RegisteredBidder;
  isSelected: boolean;
  onSelect: () => void;
}

export const BidderCard: React.FC<BidderCardProps> = ({
  bidder,
  isSelected,
  onSelect
}) => {
  return (
    <Card
      p="md"
      radius="lg"
      withBorder
      onClick={onSelect}
      style={{
        backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)',
        borderColor: isSelected ? 'var(--color-blue)' : 'var(--color-border)',
        boxShadow: isSelected ? '0 0 0 2px var(--color-blue)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      <Group justify="space-between" mb={6}>
        <Badge size="xs" variant="light" color="blue">
          {bidder.pqc_clearance_rating || 'Super Class-I National'}
        </Badge>
        <Badge size="xs" variant="light" color="teal">
          {bidder.total_contracts_won} Won Contracts
        </Badge>
      </Group>

      <Title order={4} size="xs" mb={4} style={{ color: 'var(--color-text-main)', fontWeight: 700, lineHeight: 1.3 }}>
        {bidder.name}
      </Title>

      <Group gap={4} mb="xs">
        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
        <Text size="11px" c="dimmed">
          {bidder.registered_office || (bidder.states && bidder.states[0]) || 'India'}
        </Text>
      </Group>

      {/* Financials Strip */}
      <SimpleGrid cols={2} spacing="xs" pt="xs" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <Box>
          <Text size="10px" c="dimmed">Total Awarded</Text>
          <Text size="xs" fw={700} ff="monospace" style={{ color: 'var(--color-text-main)' }}>
            {formatCr(bidder.total_awarded_value_inr)}
          </Text>
        </Box>
        <Box>
          <Text size="10px" c="dimmed">Audited Turnover</Text>
          <Text size="xs" fw={700} ff="monospace" c="grape">
            {formatCr(bidder.audited_turnover_inr)}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Financial Standing & Win Rate */}
      <SimpleGrid cols={2} spacing="xs" pt="xs" mt={4} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <Box>
          <Text size="10px" c="dimmed">Credit Rating</Text>
          <Text size="11px" fw={700} c="blue" lineClamp={1} title={bidder.credit_rating}>
            {bidder.credit_rating?.split('(')[0]?.trim() || 'CRISIL AAA'}
          </Text>
        </Box>
        <Box>
          <Text size="10px" c="dimmed">Win Rate / Book</Text>
          <Text size="11px" fw={700} c="teal" ff="monospace">
            {bidder.win_rate_pct || 68}% • {formatCr(bidder.unexecuted_order_book_inr)}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Badges strip */}
      <Group justify="space-between" pt="xs" mt={6} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <Group gap={4}>
          <Badge size="xs" variant="outline" color="gray" radius="sm">
            {bidder.categories[0] || 'Civil'}
          </Badge>
          {bidder.categories[1] && (
            <Badge size="xs" variant="outline" color="gray" radius="sm">
              +{bidder.categories.length - 1} more
            </Badge>
          )}
        </Group>

        <Badge size="xs" variant="light" color="teal" radius="sm">
          Make in India {bidder.local_content_pct}%
        </Badge>
      </Group>

      {isSelected && (
        <Box style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-blue)' }}>
          <ChevronRight className="w-5 h-5" />
        </Box>
      )}
    </Card>
  );
};
