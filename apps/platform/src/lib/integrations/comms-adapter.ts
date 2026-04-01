import type {
  CommsAdapter,
  Message,
  IntegrationConfig,
  IntegrationInfo,
} from './types';

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    channel: '#general',
    from: 'Sarah Chen',
    body: 'Q1 document analysis report is ready for review.',
    sentAt: '2026-03-31T15:30:00Z',
  },
  {
    id: 'm2',
    channel: '#sales',
    from: 'James Rivera',
    body: 'Globex wants a demo of the new integration dashboard.',
    sentAt: '2026-03-31T16:00:00Z',
  },
  {
    id: 'm3',
    channel: '#engineering',
    from: 'Bot',
    body: 'Deploy v1.2 completed successfully.',
    sentAt: '2026-04-01T08:00:00Z',
  },
];

let nextId = 4;

export class SlackAdapter implements CommsAdapter {
  private connected = false;

  info: IntegrationInfo = {
    id: 'slack',
    name: 'Slack',
    category: 'communications',
    description: 'Team messaging, channel notifications, and alerts.',
    icon: 'slack',
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

  async getMessages(channel?: string): Promise<Message[]> {
    if (channel) {
      return MOCK_MESSAGES.filter((m) => m.channel === channel);
    }
    return MOCK_MESSAGES;
  }

  async sendMessage(channel: string, body: string): Promise<Message> {
    const msg: Message = {
      id: `m${nextId++}`,
      channel,
      from: 'You',
      body,
      sentAt: new Date().toISOString(),
    };
    MOCK_MESSAGES.push(msg);
    return msg;
  }
}
