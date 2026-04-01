import type {
  ErpAdapter,
  ErpProduct,
  ErpOrder,
  IntegrationConfig,
  IntegrationInfo,
} from './types';

const MOCK_PRODUCTS: ErpProduct[] = [
  { id: 'p1', name: 'Document Analysis — Starter', sku: 'DA-START', price: 500, quantity: 999, category: 'SaaS' },
  { id: 'p2', name: 'Document Analysis — Enterprise', sku: 'DA-ENT', price: 4000, quantity: 999, category: 'SaaS' },
  { id: 'p3', name: 'Integration Gateway — Per Connector', sku: 'IG-CONN', price: 200, quantity: 999, category: 'Add-on' },
];

const MOCK_ORDERS: ErpOrder[] = [
  {
    id: 'o1',
    customerName: 'Acme Corp',
    items: [{ productId: 'p2', quantity: 1, unitPrice: 4000 }],
    total: 4000,
    status: 'processing',
    createdAt: '2026-03-20T12:00:00Z',
  },
  {
    id: 'o2',
    customerName: 'Initech',
    items: [
      { productId: 'p1', quantity: 1, unitPrice: 500 },
      { productId: 'p3', quantity: 2, unitPrice: 200 },
    ],
    total: 900,
    status: 'delivered',
    createdAt: '2026-03-15T09:00:00Z',
  },
];

export class GenericErpAdapter implements ErpAdapter {
  private connected = false;

  info: IntegrationInfo = {
    id: 'erp',
    name: 'ERP System',
    category: 'erp',
    description: 'Product catalog, orders, and inventory management.',
    icon: 'erp',
    status: 'disconnected',
    lastSyncedAt: null,
  };

  async connect(_config: IntegrationConfig): Promise<void> {
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

  async getProducts(): Promise<ErpProduct[]> {
    return MOCK_PRODUCTS;
  }

  async getOrders(): Promise<ErpOrder[]> {
    return MOCK_ORDERS;
  }
}
