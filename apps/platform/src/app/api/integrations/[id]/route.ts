import { NextResponse } from 'next/server';
import { getAdapter } from '@/lib/integrations';
import type { CrmAdapter, ErpAdapter, CommsAdapter } from '@/lib/integrations';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const adapter = getAdapter(id);
  if (!adapter) {
    return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
  }

  const info = adapter.info;
  let data: Record<string, unknown> = {};

  if (info.category === 'crm') {
    const crm = adapter as CrmAdapter;
    data = {
      contacts: await crm.getContacts(),
      deals: await crm.getDeals(),
    };
  } else if (info.category === 'erp') {
    const erp = adapter as ErpAdapter;
    data = {
      products: await erp.getProducts(),
      orders: await erp.getOrders(),
    };
  } else if (info.category === 'communications') {
    const comms = adapter as CommsAdapter;
    data = {
      messages: await comms.getMessages(),
    };
  }

  return NextResponse.json({ info, data });
}
