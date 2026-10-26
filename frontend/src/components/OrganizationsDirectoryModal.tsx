import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Badge,
  TextInput,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Card,
  SimpleGrid,
  Box,
  ActionIcon,
} from '@mantine/core';
import {
  X,
  Building2,
  Globe,
  Search,
  Award,
  Radio,
  Layers,
  MapPin,
  Train,
  Zap,
  Shield,
  Landmark
} from 'lucide-react';
import allOrgsData from '../data/all_organizations.json';

interface OrgItem {
  authority: string;
  portal: string;
  category: string;
  accepted_count: number;
  current_count: number;
  sector: string;
  state: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrg?: (orgName: string) => void;
  initialSector?: string;
}

export const OrganizationsDirectoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectOrg,
  initialSector = 'ALL'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>(initialSector);

  useEffect(() => {
    if (initialSector) {
      setSelectedSector(initialSector);
    }
  }, [initialSector, isOpen]);

  const orgs: OrgItem[] = allOrgsData as OrgItem[];

  // 25 statutory portals list
  const statutoryPortals = useMemo(() => {
    const map = new Map<string, { portal: string; orgsCount: number; activeTenders: number; awardedTenders: number }>();
    for (const o of orgs) {
      if (!map.has(o.portal)) {
        map.set(o.portal, { portal: o.portal, orgsCount: 0, activeTenders: 0, awardedTenders: 0 });
      }
      const entry = map.get(o.portal)!;
      entry.orgsCount += 1;
      entry.activeTenders += o.current_count;
      entry.awardedTenders += o.accepted_count;
    }
    return Array.from(map.values()).sort((a, b) => b.awardedTenders - a.awardedTenders);
  }, [orgs]);

  const sectors = [
    { id: 'ALL', label: 'All Organizations', count: orgs.length, icon: Landmark },
    { id: 'Central Infra & Works', label: 'Central Infra & Works', count: orgs.filter((o) => o.sector === 'Central Infra & Works').length, icon: Building2 },
    { id: 'Railways & Metros', label: 'Railways & Metros', count: orgs.filter((o) => o.sector === 'Railways & Metros').length, icon: Train },
    { id: 'PSUs & Energy', label: 'PSUs & Energy', count: orgs.filter((o) => o.sector === 'PSUs & Energy').length, icon: Zap },
    { id: 'Defense & Paramilitary', label: 'Defense & Security', count: orgs.filter((o) => o.sector === 'Defense & Paramilitary').length, icon: Shield },
    { id: 'State Governments & Local Bodies', label: '19 States & Local Bodies', count: orgs.filter((o) => o.sector === 'State Governments & Local Bodies').length, icon: MapPin },
    { id: 'PORTALS', label: '25 Statutory Portals', count: statutoryPortals.length, icon: Globe }
  ];

  const filteredOrgs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return orgs.filter((o) => {
      if (selectedSector !== 'ALL' && selectedSector !== 'PORTALS' && o.sector !== selectedSector) {
        return false;
      }
      if (!q) return true;
      return (
        o.authority.toLowerCase().includes(q) ||
        o.portal.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.state.toLowerCase().includes(q) ||
        o.sector.toLowerCase().includes(q)
      );
    });
  }, [orgs, selectedSector, searchQuery]);

  const filteredPortals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return statutoryPortals.filter((p) => {
      if (!q) return true;
      return p.portal.toLowerCase().includes(q);
    });
  }, [statutoryPortals, searchQuery]);

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
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>
        {/* Header Bar */}
        <Group justify="space-between" align="center" px="xl" py="md" style={{ backgroundColor: '#070a10', color: '#ffffff', borderBottom: '1px solid #1e293b' }}>
          <div>
            <Group gap="xs" mb={4}>
              <Badge color="orange" size="sm" radius="xl" leftSection={<Globe className="w-3.5 h-3.5" />}>
                Pan-India Sourcing Directory
              </Badge>
              <Text size="xs" c="dimmed" ff="monospace">100% Statutory Public Feeds</Text>
            </Group>
            <Title order={3} size="h4" style={{ color: '#ffffff', fontWeight: 700 }}>
              All 123 Sourced Indian Authorities & 25 Statutory Portals
            </Title>
          </div>

          <ActionIcon variant="subtle" color="gray" size="lg" radius="md" onClick={onClose} aria-label="Close directory">
            <X className="w-5 h-5 text-white" />
          </ActionIcon>
        </Group>

        {/* Stats Strip */}
        <Group justify="space-between" px="xl" py="xs" style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)' }}>
          <Group gap="md">
            <Group gap={6}>
              <Building2 className="w-4 h-4 text-orange-500" />
              <Text size="xs" fw={600} style={{ color: 'var(--color-text-main)' }}><strong>123</strong> Government Organizations</Text>
            </Group>
            <Text c="dimmed">•</Text>
            <Group gap={6}>
              <Globe className="w-4 h-4 text-blue-500" />
              <Text size="xs" fw={600} style={{ color: 'var(--color-text-main)' }}><strong>25</strong> National & State Portals</Text>
            </Group>
            <Text c="dimmed">•</Text>
            <Group gap={6}>
              <Award className="w-4 h-4 text-emerald-500" />
              <Text size="xs" fw={600} style={{ color: 'var(--color-text-main)' }}><strong>4,350+</strong> Awarded Contracts</Text>
            </Group>
            <Text c="dimmed">•</Text>
            <Group gap={6}>
              <Radio className="w-4 h-4 text-orange-500" />
              <Text size="xs" fw={600} style={{ color: 'var(--color-text-main)' }}><strong>2,718</strong> Live Notices</Text>
            </Group>
          </Group>

          <Text size="11px" ff="monospace" c="dimmed">Enterprise Persistent DB • In-Memory Stream</Text>
        </Group>

        {/* Search & Sector Filters */}
        <Box p="md" px="xl" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <TextInput
            placeholder="Search by organization name (NHAI, CPWD, BHEL, DMRC, MahaPWD...), state, or portal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search className="w-4 h-4 text-slate-400" />}
            rightSection={
              searchQuery ? (
                <Button variant="subtle" size="compact-xs" color="gray" onClick={() => setSearchQuery('')}>
                  Clear
                </Button>
              ) : null
            }
            radius="md"
            size="sm"
            mb="sm"
          />

          {/* Sector Tabs */}
          <Group gap="xs" wrap="nowrap" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            {sectors.map((sec) => {
              const Icon = sec.icon;
              const isActive = selectedSector === sec.id;
              return (
                <Button
                  key={sec.id}
                  variant={isActive ? 'filled' : 'light'}
                  color={isActive ? 'dark' : 'gray'}
                  size="xs"
                  radius="md"
                  leftSection={<Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : ''}`} />}
                  rightSection={
                    <Badge size="xs" variant={isActive ? 'white' : 'light'} color={isActive ? 'dark' : 'gray'} radius="xl">
                      {sec.count}
                    </Badge>
                  }
                  onClick={() => setSelectedSector(sec.id)}
                  styles={{ root: { flexShrink: 0, fontWeight: 600 } }}
                >
                  {sec.label}
                </Button>
              );
            })}
          </Group>
        </Box>

        {/* Directory Body */}
        <Box p="lg" px="xl" style={{ overflowY: 'auto', flex: 1, backgroundColor: 'var(--color-canvas)' }}>
          {selectedSector === 'PORTALS' ? (
            /* 25 Portals Grid */
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
              {filteredPortals.map((p, idx) => {
                const domain = p.portal.match(/\((.*?)\)/)?.[1] || p.portal;
                const portalName = p.portal.split('(')[0].trim();
                return (
                  <Card
                    key={idx}
                    p="md"
                    radius="lg"
                    withBorder
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Badge size="xs" color="blue" variant="light" leftSection={<Globe className="w-3 h-3" />}>
                          200 OK Active Feed
                        </Badge>
                        <Text size="10px" c="dimmed" ff="monospace">#{idx + 1}</Text>
                      </Group>

                      <Title order={4} size="xs" mb={2} style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>
                        {portalName}
                      </Title>
                      <Text size="11px" ff="monospace" c="blue" style={{ wordBreak: 'break-all', marginBottom: 12 }}>
                        {domain}
                      </Text>
                    </div>

                    <Group justify="space-between" pt="xs" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                      <div>
                        <Text size="10px" c="dimmed">Executing Bodies</Text>
                        <Text size="xs" fw={700} style={{ color: 'var(--color-text-main)' }}>{p.orgsCount} Orgs</Text>
                      </div>
                      <Box style={{ textAlign: 'right' }}>
                        <Text size="10px" c="dimmed">Tenders Catalog</Text>
                        <Group gap={4}>
                          <Text size="xs" fw={700} c="teal">{p.awardedTenders} Awarded</Text>
                          <Text size="xs" c="dimmed">•</Text>
                          <Text size="xs" fw={700} c="orange">{p.activeTenders} Live</Text>
                        </Group>
                      </Box>
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          ) : (
            /* 123 Organizations Grid */
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
              {filteredOrgs.map((o, idx) => {
                const portalShort = o.portal.split('(')[0].trim();
                return (
                  <Card
                    key={idx}
                    p="md"
                    radius="lg"
                    withBorder
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Badge size="xs" variant="light" color="red" leftSection={<MapPin className="w-3 h-3" />}>
                          {o.state}
                        </Badge>
                        <Badge size="xs" variant="light" color="grape" style={{ maxWidth: 140 }}>
                          {o.sector}
                        </Badge>
                      </Group>

                      <Title order={4} size="xs" mb={4} style={{ color: 'var(--color-text-main)', fontWeight: 700, lineHeight: 1.3 }}>
                        {o.authority}
                      </Title>

                      <Group gap={4} mb="xs">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <Text size="11px" c="dimmed" lineClamp={1}>{o.category}</Text>
                      </Group>
                    </div>

                    <Box pt="xs" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                      <Text size="10px" c="dimmed" lineClamp={1} mb={6} title={o.portal}>
                        <strong>Source: </strong>{portalShort}
                      </Text>

                      <Group justify="space-between" align="center">
                        <Group gap={6}>
                          <Badge size="xs" variant="light" color="teal">
                            {o.accepted_count} Awarded
                          </Badge>
                          <Badge size="xs" variant="light" color="orange">
                            {o.current_count} Live
                          </Badge>
                        </Group>

                        {onSelectOrg && (
                          <Button
                            variant="subtle"
                            color="orange"
                            size="compact-xs"
                            onClick={() => {
                              onSelectOrg(o.authority);
                              onClose();
                            }}
                            styles={{ root: { fontWeight: 700 } }}
                          >
                            Filter Tenders →
                          </Button>
                        )}
                      </Group>
                    </Box>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}

          {filteredOrgs.length === 0 && selectedSector !== 'PORTALS' && (
            <Stack align="center" justify="center" py="xl" gap="xs">
              <Building2 className="w-8 h-8 text-slate-400" />
              <Text size="xs" c="dimmed">No organizations found matching "{searchQuery}"</Text>
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Group justify="space-between" px="xl" py="sm" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <Text size="11px" c="dimmed">
            National Public Procurement Catalog • Unified Portal Framework (CPPP, GeM, IREPS, MoD & 19 States)
          </Text>

          <Button variant="default" size="xs" radius="md" onClick={onClose}>
            Close Directory
          </Button>
        </Group>
      </div>
    </Modal>
  );
};
