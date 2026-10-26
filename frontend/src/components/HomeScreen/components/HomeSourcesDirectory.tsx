import React, { useState, useMemo } from 'react';
import { Title, Text, Badge, SimpleGrid, Button, Paper, Select, Group, Stack, Box } from '@mantine/core';
import { Globe, Filter, RefreshCw } from 'lucide-react';
import { REAL_PORTAL_SOURCES } from '../../../constants/portalSources';
import { PortalSourceCard } from './PortalSourceCard';
import { FilterSearchBar } from '../../common';

export interface HomeSourcesDirectoryProps {
  onNavigate: (tab: 'current' | 'accepted' | 'bidders') => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HomeSourcesDirectory: React.FC<HomeSourcesDirectoryProps> = ({
  onNavigate,
  onTriggerSync,
  isSyncing
}) => {
  const [portalSearch, setPortalSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Filtered Portal Sources
  const filteredPortals = useMemo(() => {
    return REAL_PORTAL_SOURCES.filter((portal) => {
      if (selectedCategory !== 'ALL' && portal.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'ALL' && portal.region !== selectedRegion) {
        return false;
      }
      if (portalSearch.trim()) {
        const q = portalSearch.toLowerCase().trim();
        const blob = `${portal.name} ${portal.domain} ${portal.state} ${portal.region} ${portal.description} ${portal.keyAuthorities.join(' ')} ${portal.procurementTypes.join(' ')}`.toLowerCase();
        return blob.includes(q);
      }
      return true;
    });
  }, [portalSearch, selectedCategory, selectedRegion]);

  return (
    <Stack gap="md" id="real-sources-directory" pt="sm">
      {/* Section Header */}
      <Group justify="space-between" align="flex-end" pb="xs" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Stack gap={4}>
          <Group gap="xs">
            <Badge color="cyan" variant="light" size="sm" radius="sm" leftSection={<Globe className="w-3 h-3" />}>
              Statutory Source Directory
            </Badge>
            <Title order={2} size="h3" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              What All Real Sources Are We Sourcing From?
            </Title>
          </Group>
          <Text size="xs" style={{ color: 'var(--color-text-muted)' }}>
            Direct statutory ingestion from {REAL_PORTAL_SOURCES.length} official national procurement platforms, state government portals, and open data feeds.
          </Text>
        </Stack>

        <Group gap="xs">
          <Badge variant="outline" color="gray" size="lg" radius="md">
            Showing <strong style={{ color: 'var(--color-text-main)', margin: '0 4px' }}>{filteredPortals.length}</strong> of {REAL_PORTAL_SOURCES.length} Real Portals
          </Badge>
          <Button
            color="teal"
            radius="md"
            size="xs"
            leftSection={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
            loading={isSyncing}
            onClick={onTriggerSync}
            styles={{ root: { fontWeight: 700 } }}
          >
            {isSyncing ? 'Scraping Live...' : 'Sync Live Scraper'}
          </Button>
        </Group>
      </Group>

      {/* Search & Category Filter Toolbar */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            {/* Search Bar */}
            <Box style={{ flex: 1, maxWidth: 520 }}>
              <FilterSearchBar
                searchQuery={portalSearch}
                setSearchQuery={setPortalSearch}
                placeholder="Search portal name, domain, state, or authority (NHAI, DMRC)..."
                variant="light"
                accentColor="blue"
              />
            </Box>

            {/* Region Select */}
            <Select
              size="xs"
              radius="md"
              label="Region"
              value={selectedRegion}
              onChange={(val) => setSelectedRegion(val || 'ALL')}
              data={[
                { value: 'ALL', label: 'All Regions (India)' },
                { value: 'National', label: 'National / Central' },
                { value: 'North', label: 'North India' },
                { value: 'South', label: 'South India' },
                { value: 'West', label: 'West India' },
                { value: 'East & Central', label: 'East & Central' },
                { value: 'North East', label: 'North East' }
              ]}
              style={{ width: 190 }}
            />
          </Group>

          {/* Category Filter Pills */}
          <Group gap={6} pt="xs" style={{ borderTop: '1px solid var(--color-border-subtle)' }} wrap="wrap">
            <Group gap={4}>
              <Filter className="w-3 h-3 text-slate-400" />
              <Text size="11px" fw={600} c="dimmed">Jurisdiction:</Text>
            </Group>
            {[
              { id: 'ALL', label: `All Portals (${REAL_PORTAL_SOURCES.length})` },
              { id: 'Central', label: 'Central Government' },
              { id: 'State', label: 'State Governments' },
              { id: 'Defense & PSU', label: 'Defense & Energy PSUs' },
              { id: 'Railways', label: 'Railways (IREPS)' },
              { id: 'Open Data', label: 'Open Data (data.gov.in)' }
            ].map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'filled' : 'subtle'}
                color={selectedCategory === cat.id ? 'cyan' : 'gray'}
                size="compact-xs"
                radius="md"
                onClick={() => setSelectedCategory(cat.id)}
                styles={{ root: { fontWeight: 600 } }}
              >
                {cat.label}
              </Button>
            ))}
          </Group>
        </Stack>
      </Paper>

      {/* Portals Cards Grid */}
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
        {filteredPortals.map((portal) => (
          <PortalSourceCard
            key={portal.id}
            portal={portal}
            onNavigate={onNavigate}
          />
        ))}
      </SimpleGrid>

      {filteredPortals.length === 0 && (
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            textAlign: 'center',
          }}
        >
          <Stack align="center" gap="xs">
            <Globe className="w-8 h-8 text-slate-400" />
            <Text fw={600} size="sm">No portal matched your search "{portalSearch}".</Text>
            <Button
              variant="subtle"
              color="cyan"
              size="xs"
              onClick={() => { setPortalSearch(''); setSelectedCategory('ALL'); setSelectedRegion('ALL'); }}
            >
              Reset portal search & filters
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};
