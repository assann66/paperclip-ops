import { HubSpotAdapter } from './crm-adapter';
import { GenericErpAdapter } from './erp-adapter';
import { SlackAdapter } from './comms-adapter';
import type { BaseAdapter, IntegrationInfo } from './types';

const adapters: Record<string, BaseAdapter> = {
  hubspot: new HubSpotAdapter(),
  erp: new GenericErpAdapter(),
  slack: new SlackAdapter(),
};

// Auto-connect all adapters with empty config for demo mode
for (const adapter of Object.values(adapters)) {
  adapter.connect({});
}

export function getAdapter(id: string): BaseAdapter | undefined {
  return adapters[id];
}

export function listIntegrations(): IntegrationInfo[] {
  return Object.values(adapters).map((a) => a.info);
}

export { HubSpotAdapter, GenericErpAdapter, SlackAdapter };
export type * from './types';
