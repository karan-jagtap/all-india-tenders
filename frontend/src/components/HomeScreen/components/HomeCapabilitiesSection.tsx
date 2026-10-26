import React from 'react';
import { Title, Text, Badge, SimpleGrid, Card, ThemeIcon, Button, Group, Stack, List } from '@mantine/core';
import { Radio, Award, Users, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export interface HomeCapabilitiesSectionProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
}

export const HomeCapabilitiesSection: React.FC<HomeCapabilitiesSectionProps> = ({ onNavigate }) => {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end" pb="xs" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Stack gap={4}>
          <Group gap="xs">
            <Badge color="orange" variant="light" size="sm" radius="sm">
              Core Capabilities
            </Badge>
            <Title order={2} size="h3" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              What Our Application Does
            </Title>
          </Group>
          <Text size="xs" style={{ color: 'var(--color-text-muted)' }}>
            Engineered specifically for infrastructure contractors, EPC estimators, pre-bid analysts, and government procurement officers.
          </Text>
        </Stack>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Pillar 1: In-Progress Unfilled Tenders */}
        <Card
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack gap="md">
            <ThemeIcon color="orange" variant="light" size={42} radius="lg">
              <Radio className="w-5 h-5 animate-pulse" />
            </ThemeIcon>
            <Title order={3} size="h5" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              1. Live In-Progress Tender Discovery & Document Viewer
            </Title>
            <Text size="xs" style={{ color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
              Direct statutory scraping of active, unfilled notices across 28+ Central and State procurement portals. Inspect comprehensive tender details without registering on individual state portals.
            </Text>
            <List
              spacing="xs"
              size="xs"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              style={{ color: 'var(--color-text-sub)' }}
            >
              <List.Item>
                <strong>Full 48-Page Standard Bidding Document (SBD):</strong> In-app interactive viewer & 1-click PDF download.
              </List.Item>
              <List.Item>
                <strong>Volume I–IV Specifications:</strong> Instructions to Bidders, GCC, Technical Specs & BOQ Rate Schedules.
              </List.Item>
              <List.Item>
                <strong>Statutory Pre-Qualification (PQC):</strong> Automated 3-2-1 similar work rules, turnover, and net worth checks.
              </List.Item>
              <List.Item>
                <strong>GFR Rule 170 / MSME Exemptions:</strong> Real-time assessment of EMD waivers and technical exemptions.
              </List.Item>
            </List>
          </Stack>
          <Button
            color="orange"
            variant="light"
            radius="md"
            size="sm"
            fullWidth
            mt="lg"
            rightSection={<ChevronRight className="w-4 h-4" />}
            onClick={() => onNavigate('current')}
            styles={{ root: { fontWeight: 700 } }}
          >
            Explore In-Progress Tenders
          </Button>
        </Card>

        {/* Pillar 2: 17-Year Awarded Bids Archive */}
        <Card
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack gap="md">
            <ThemeIcon color="teal" variant="light" size={42} radius="lg">
              <Award className="w-5 h-5" />
            </ThemeIcon>
            <Title order={3} size="h5" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              2. 17-Year Awarded Bids & Letters of Acceptance (LOA) Archive
            </Title>
            <Text size="xs" style={{ color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
              Explore how leading contractors (L&T, Tata Projects, Afcons, Dilip Buildcon, NCC, B.G. Shirke) structured winning bids, technical submissions, and secured official government work orders.
            </Text>
            <List
              spacing="xs"
              size="xs"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              style={{ color: 'var(--color-text-sub)' }}
            >
              <List.Item>
                <strong>4,350+ Historical Awarded Dossiers:</strong> Covering awarded contracts from 2010 to 2026 across India.
              </List.Item>
              <List.Item>
                <strong>Winning Price vs Estimate Rebate:</strong> Exact percentage variance (% below or above estimated cost).
              </List.Item>
              <List.Item>
                <strong>3-Cover Submission Structure:</strong> Fee/EMD Cover, Technical Experience Cover, and Financial Price Bid.
              </List.Item>
              <List.Item>
                <strong>Official LOA Orders:</strong> Work orders with bank guarantee mandates and milestone delivery schedules.
              </List.Item>
            </List>
          </Stack>
          <Button
            color="teal"
            variant="light"
            radius="md"
            size="sm"
            fullWidth
            mt="lg"
            rightSection={<ChevronRight className="w-4 h-4" />}
            onClick={() => onNavigate('accepted')}
            styles={{ root: { fontWeight: 700 } }}
          >
            Search Awarded Bids Archive
          </Button>
        </Card>

        {/* Pillar 3: Registered Contractors Intelligence */}
        <Card
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack gap="md">
            <ThemeIcon color="blue" variant="light" size={42} radius="lg">
              <Users className="w-5 h-5" />
            </ThemeIcon>
            <Title order={3} size="h5" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              3. Registered Contractors Directory & Financial Profiling
            </Title>
            <Text size="xs" style={{ color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
              Comprehensive directory of 87 registered infrastructure and EPC contractors across India, complete with corporate credentials, audited financials, past awards, and Joint Venture (JV) eligibility.
            </Text>
            <List
              spacing="xs"
              size="xs"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              style={{ color: 'var(--color-text-sub)' }}
            >
              <List.Item>
                <strong>Audited Financial Metrics:</strong> 3-year average annual turnover, tangible net worth, and active work-in-hand.
              </List.Item>
              <List.Item>
                <strong>Max Single-Work Capacity:</strong> Calculated according to statutory NHAI & CPWD bid formulas.
              </List.Item>
              <List.Item>
                <strong>Sector Specializations:</strong> Highways, Bridges, Metro/Rail, Water & Sanitation, and Commercial Buildings.
              </List.Item>
              <List.Item>
                <strong>Corporate Registrations:</strong> CIN numbers, GSTIN, PAN, and Primary Banker branches.
              </List.Item>
            </List>
          </Stack>
          <Button
            color="blue"
            variant="light"
            radius="md"
            size="sm"
            fullWidth
            mt="lg"
            rightSection={<ChevronRight className="w-4 h-4" />}
            onClick={() => onNavigate('bidders')}
            styles={{ root: { fontWeight: 700 } }}
          >
            Inspect Registered Contractors
          </Button>
        </Card>

        {/* Pillar 4: Deep RAG Analytics & Competitor Simulation */}
        <Card
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack gap="md">
            <ThemeIcon color="grape" variant="light" size={42} radius="lg">
              <Sparkles className="w-5 h-5" />
            </ThemeIcon>
            <Title order={3} size="h5" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              4. AI Competitor Simulation & Deep RAG Clause Analytics
            </Title>
            <Text size="xs" style={{ color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
              Advanced analytical models evaluating tender competition probability and parsing dense contract clauses from RFP documents in real time.
            </Text>
            <List
              spacing="xs"
              size="xs"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              style={{ color: 'var(--color-text-sub)' }}
            >
              <List.Item>
                <strong>AI L1 Bidder Prediction:</strong> Mathematical simulation predicting top competing bidders and win probabilities.
              </List.Item>
              <List.Item>
                <strong>Clause-by-Clause RAG Querying:</strong> Instant retrieval of critical liquidated damages, defect liability & mobilization terms.
              </List.Item>
              <List.Item>
                <strong>BOQ Rate Schedule Insights:</strong> Historical unit pricing benchmarks for cement, steel, earthwork, and bitumen.
              </List.Item>
              <List.Item>
                <strong>Voice-Driven Search:</strong> Hands-free voice querying across reference numbers, cities, and ministries.
              </List.Item>
            </List>
          </Stack>
          <Button
            color="grape"
            variant="light"
            radius="md"
            size="sm"
            fullWidth
            mt="lg"
            rightSection={<ChevronRight className="w-4 h-4" />}
            onClick={() => onNavigate('current')}
            styles={{ root: { fontWeight: 700 } }}
          >
            Explore AI Analytics on Tenders
          </Button>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};
