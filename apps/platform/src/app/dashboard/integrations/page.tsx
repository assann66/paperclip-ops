'use client';

import { useEffect, useState } from 'react';
import type { IntegrationInfo } from '@/lib/integrations/types';

const categoryLabels: Record<string, string> = {
  crm: 'CRM',
  erp: 'ERP',
  communications: 'Communications',
};

const categoryColors: Record<string, string> = {
  crm: 'bg-blue-100 text-blue-800',
  erp: 'bg-purple-100 text-purple-800',
  communications: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  connected: 'bg-emerald-500',
  disconnected: 'bg-gray-400',
  error: 'bg-red-500',
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ info: IntegrationInfo; data: Record<string, unknown[]> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/integrations')
      .then((r) => r.json())
      .then((data) => {
        setIntegrations(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    fetch(`/api/integrations/${selected}`)
      .then((r) => r.json())
      .then(setDetail);
  }, [selected]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-muted">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted mt-1">
          Connect your business tools to the AI platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {integrations.map((integration) => (
          <button
            key={integration.id}
            onClick={() => setSelected(selected === integration.id ? null : integration.id)}
            className={`text-left border rounded-xl p-5 transition-all hover:shadow-md ${
              selected === integration.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[integration.category] ?? 'bg-gray-100 text-gray-800'}`}
              >
                {categoryLabels[integration.category] ?? integration.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className={`w-2 h-2 rounded-full ${statusColors[integration.status]}`}
                />
                {integration.status}
              </span>
            </div>
            <h3 className="font-semibold">{integration.name}</h3>
            <p className="text-sm text-muted mt-1">{integration.description}</p>
            {integration.lastSyncedAt && (
              <p className="text-xs text-muted mt-3">
                Last synced: {new Date(integration.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </button>
        ))}
      </div>

      {detail && (
        <div className="border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {detail.info.name} — Data Preview
          </h2>
          {Object.entries(detail.data).map(([key, rows]) => (
            <div key={key} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-2">
                {key} ({(rows as unknown[]).length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {Object.keys((rows as Record<string, unknown>[])[0] ?? {}).map(
                        (col) => (
                          <th
                            key={col}
                            className="text-left py-2 px-3 font-medium text-muted"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(rows as Record<string, unknown>[]).map(
                      (row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="py-2 px-3">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                            </td>
                          ))}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
