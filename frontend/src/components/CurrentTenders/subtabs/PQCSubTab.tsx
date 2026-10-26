import React, { useState } from 'react';
import {
  Card,
  Badge,
  Text,
  Title,
  Group,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Collapse,
  Button,
  Paper,
  Divider,
} from '@mantine/core';
import { 
  CheckCircle2, 
  TrendingUp, 
  Landmark, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';
import { EnrichedCurrentTender } from '../../../types';

export interface PQCSubTabProps {
  selectedTender: EnrichedCurrentTender;
}

export const PQCSubTab: React.FC<PQCSubTabProps> = ({ selectedTender }) => {
  const [showFullClauses, setShowFullClauses] = useState(false);

  const estCost = selectedTender.estimated_cost_inr || 0;

  // Extract primary amounts using regex or calculated fallbacks
  const extractAmount = (text?: string, fallbackMultiplier?: number): string => {
    if (text) {
      const match = text.match(/₹\s*([0-9.,]+(?:\s*(?:Cr|Crore|Lakh|Lakhs))?)/i);
      if (match) return `₹ ${match[1].trim()}`;
    }
    if (estCost && fallbackMultiplier) {
      const val = estCost * fallbackMultiplier;
      return val >= 10000000 
        ? `₹ ${(val / 10000000).toFixed(2)} Cr` 
        : `₹ ${(val / 100000).toFixed(2)} Lakh`;
    }
    return 'As per NIT';
  };

  const extractExpAmounts = (text?: string) => {
    if (text) {
      const matches = Array.from(text.matchAll(/₹\s*([0-9.,]+(?:\s*(?:Cr|Crore|Lakh|Lakhs))?)/gi));
      if (matches.length >= 3) {
        return {
          work3: `₹ ${matches[0][1].trim()}`,
          work2: `₹ ${matches[1][1].trim()}`,
          work1: `₹ ${matches[2][1].trim()}`,
          headline: `₹ ${matches[2][1].trim()}`
        };
      }
      if (matches.length === 1) {
        const val = `₹ ${matches[0][1].trim()}`;
        return { work3: val, work2: val, work1: val, headline: val };
      }
    }
    const fmt = (v: number) => v >= 10000000 ? `₹ ${(v / 10000000).toFixed(2)} Cr` : `₹ ${(v / 100000).toFixed(2)} Lakh`;
    return {
      work3: fmt(estCost * 0.4),
      work2: fmt(estCost * 0.5),
      work1: fmt(estCost * 0.8),
      headline: fmt(estCost * 0.8)
    };
  };

  const turnoverAmount = extractAmount(selectedTender.turnover_criteria, 0.4);
  const solvencyAmount = extractAmount(selectedTender.solvency_criteria, 0.2);
  const expAmounts = extractExpAmounts(selectedTender.experience_criteria);

  return (
    <Card p="lg" radius="lg" withBorder shadow="xs">
      {/* Header */}
      <Group justify="space-between" mb="md" wrap="wrap">
        <div>
          <Group gap="xs">
            <ShieldCheck size={18} color="#ea580c" />
            <Title order={5} tt="uppercase" lts={1} fz="xs" fw={700}>
              Pre-Qualification & Eligibility Criteria (PQC)
            </Title>
          </Group>
          <Text size="xs" c="dimmed" mt={4}>
            Mandatory Cover-2 qualification thresholds required before price bid opening.
          </Text>
        </div>
        <Group gap="xs">
          <Badge color="teal" variant="light" size="sm" leftSection={<CheckCircle2 size={12} />}>
            Cover-2 Mandatory
          </Badge>
          <Badge color="gray" variant="outline" size="sm">
            GFR 2017
          </Badge>
        </Group>
      </Group>

      <Divider mb="md" />

      {/* 3 Simpler Metric Cards Grid (Mantine SimpleGrid & Card) */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {/* Card 1: Annual Turnover */}
        <Card p="md" radius="md" withBorder style={{ backgroundColor: 'var(--color-blue-subtle)' }}>
          <Stack justify="space-between" h="100%">
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="11px" fw={700} tt="uppercase" c="blue">
                  Annual Turnover
                </Text>
                <ThemeIcon color="blue" variant="light" size="sm" radius="md">
                  <TrendingUp size={14} />
                </ThemeIcon>
              </Group>
              <Text fz={{ base: 'xl', sm: '26px' }} fw={900} ff="monospace">
                {turnoverAmount}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Min. average annual turnover (40%)
              </Text>
            </div>
            <div>
              <Divider my="xs" opacity={0.5} />
              <Group justify="space-between">
                <Text size="10px" c="dimmed">Period: Past 3 Audited FY</Text>
                <Text size="10px" fw={700} c="blue">CA UDIN</Text>
              </Group>
            </div>
          </Stack>
        </Card>

        {/* Card 2: Bank Solvency */}
        <Card p="md" radius="md" withBorder style={{ backgroundColor: 'var(--color-purple-subtle)' }}>
          <Stack justify="space-between" h="100%">
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="11px" fw={700} tt="uppercase" c="grape">
                  Bank Solvency
                </Text>
                <ThemeIcon color="grape" variant="light" size="sm" radius="md">
                  <Landmark size={14} />
                </ThemeIcon>
              </Group>
              <Text fz={{ base: 'xl', sm: '26px' }} fw={900} ff="monospace">
                {solvencyAmount}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Banker's Solvency Certificate (20%)
              </Text>
            </div>
            <div>
              <Divider my="xs" opacity={0.5} />
              <Group justify="space-between">
                <Text size="10px" c="dimmed">Issuer: Scheduled Bank</Text>
                <Text size="10px" fw={700} c="grape">Form C</Text>
              </Group>
            </div>
          </Stack>
        </Card>

        {/* Card 3: Similar Work Experience */}
        <Card p="md" radius="md" withBorder style={{ backgroundColor: 'var(--color-emerald-subtle)' }}>
          <Stack justify="space-between" h="100%">
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="11px" fw={700} tt="uppercase" c="teal">
                  Similar Work (3-2-1)
                </Text>
                <ThemeIcon color="teal" variant="light" size="sm" radius="md">
                  <Award size={14} />
                </ThemeIcon>
              </Group>
              <Text fz={{ base: 'xl', sm: '26px' }} fw={900} ff="monospace">
                {expAmounts.headline}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                1 work @ 80% or equivalent past 7 yrs
              </Text>
            </div>
            <div>
              <Divider my="xs" opacity={0.5} />
              <Group justify="space-between">
                <Text size="10px" c="dimmed">2 works: {expAmounts.work2}</Text>
                <Text size="10px" fw={700} c="teal">3 works: {expAmounts.work3}</Text>
              </Group>
            </div>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Expandable Detailed Statutory NIT Clauses */}
      <Stack mt="md" gap="xs">
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={() => setShowFullClauses(!showFullClauses)}
          leftSection={<FileText size={14} />}
          rightSection={showFullClauses ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          justify="flex-start"
          p={0}
        >
          {showFullClauses ? 'Hide Detailed Legal NIT Clauses' : 'View Detailed Legal NIT Clauses & Criteria Text'}
        </Button>

        <Collapse in={showFullClauses}>
          <Paper p="sm" radius="md" withBorder mt="xs">
            <Stack gap="xs">
              <div>
                <Text size="xs" fw={700} mb={2}>Turnover Clause:</Text>
                <Text size="xs" c="dimmed">{selectedTender.turnover_criteria || 'As per NIT'}</Text>
              </div>
              <div>
                <Text size="xs" fw={700} mb={2}>Bank Solvency Clause:</Text>
                <Text size="xs" c="dimmed">{selectedTender.solvency_criteria || 'As per NIT'}</Text>
              </div>
              <div>
                <Text size="xs" fw={700} mb={2}>Work Experience Clause:</Text>
                <Text size="xs" c="dimmed">{selectedTender.experience_criteria || 'As per NIT'}</Text>
              </div>
            </Stack>
          </Paper>
        </Collapse>
      </Stack>
    </Card>
  );
};
