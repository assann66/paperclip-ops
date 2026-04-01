import type { CrmAdapter, CrmContact, CrmDeal, IntegrationConfig, IntegrationInfo } from './types';

const MOCK_CONTACTS: CrmContact[] = [
  {
    id: 'c1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@acmecorp.com',
    company: 'Acme Corp',
    phone: '+1-555-0101',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'c2',
    firstName: 'James',
    lastName: 'Rivera',
    email: 'j.rivera@globex.io',
    company: 'Globex Industries',
    phone: '+1-555-0202',
    createdAt: '2026-02-03T14:30:00Z',
  },
  {
    id: 'c3',
    firstName: 'Aisha',
    lastName: 'Patel',
    email: 'aisha@initech.co',
    company: 'Initech',
    createdAt: '2026-03-10T09:15:00Z',
  },
];

const MOCK_DEALS: CrmDeal[] = [
  {
    id: 'd1',
    name: 'Acme Corp — Enterprise Plan',
    value: 48000,
    stage: 'proposal',
    contactId: 'c1',
    closedAt: null,
    createdAt: '2026-02-20T11:00:00Z',
  },
  {
    id: 'd2',
    name: 'Globex — Document Analytics POC',
    value: 12000,
    stage: 'negotiation',
    contactId: 'c2',
    closedAt: null,
    createdAt: '2026-03-05T16:00:00Z',
  },
  {
    id: 'd3',
    name: 'Initech — Starter Package',
    value: 6000,
    stage: 'closed_won',
    contactId: 'c3',
    closedAt: '2026-03-28T10:00:00Z',
    createdAt: '2026-03-12T08:00:00Z',
  },
];

export class HubSpotAdapter implements CrmAdapter {
  private connected = false;

  info: IntegrationInfo = {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'crm',
    description: 'Sync contacts, deals, and pipeline data from HubSpot.',
    icon: 'hubspot',
    status: 'disconnected',
    lastSyncedAt: null,
  };

  async connect(_config: IntegrationConfig): Promise<void> {
    // In production, validate the API key against HubSpot's API
    this.connected = true;
    this.info.status = 'connected';
    this.info.lastSyncedAt = new Date().toISOString();
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.info.status = 'disconnected';
  }

  async testConnection(): Promise<boolean> {
    return this.connected;
  }

  async getContacts(): Promise<CrmContact[]> {
    return MOCK_CONTACTS;
  }

  async getDeals(): Promise<CrmDeal[]> {
    return MOCK_DEALS;
  }
}
