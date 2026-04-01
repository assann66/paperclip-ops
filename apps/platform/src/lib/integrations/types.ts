export type IntegrationCategory = 'crm' | 'erp' | 'communications';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface IntegrationConfig {
  apiKey?: string;
  baseUrl?: string;
  [key: string]: string | undefined;
}

export interface IntegrationInfo {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: string;
  status: ConnectionStatus;
  lastSyncedAt: string | null;
}

export interface CrmContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
  createdAt: string;
}

export interface CrmDeal {
  id: string;
  name: string;
  value: number;
  stage: string;
  contactId: string;
  closedAt: string | null;
  createdAt: string;
}

export interface ErpProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ErpOrder {
  id: string;
  customerName: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Message {
  id: string;
  channel: string;
  from: string;
  body: string;
  sentAt: string;
}

export interface BaseAdapter<TConfig extends IntegrationConfig = IntegrationConfig> {
  info: IntegrationInfo;
  connect(config: TConfig): Promise<void>;
  disconnect(): Promise<void>;
  testConnection(): Promise<boolean>;
}

export interface CrmAdapter extends BaseAdapter {
  getContacts(): Promise<CrmContact[]>;
  getDeals(): Promise<CrmDeal[]>;
}

export interface ErpAdapter extends BaseAdapter {
  getProducts(): Promise<ErpProduct[]>;
  getOrders(): Promise<ErpOrder[]>;
}

export interface CommsAdapter extends BaseAdapter {
  getMessages(channel?: string): Promise<Message[]>;
  sendMessage(channel: string, body: string): Promise<Message>;
}
