import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const newOrderTrigger = createTrigger({
  name: 'new_order',
  displayName: 'New Order',
  description: 'Triggers when a new order is placed on Digikala',
  auth: digikalaAuth,
  props: {
    status: Property.StaticDropdown({
      displayName: 'Order Status Filter',
      description: 'Only trigger for orders with this status (leave empty for all)',
      required: false,
      options: {
        options: [
          { label: 'All Orders', value: '' },
          { label: 'Pending Payment', value: 'PENDING_PAYMENT' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Processing', value: 'PROCESSING' },
        ],
      },
    }),
  },
  sampleData: {
    id: 'ORD-123456',
    status: 'CONFIRMED',
    customerId: 'CUST-789',
    totalAmount: 1500000,
    currency: 'IRR',
    items: [
      {
        sku: 'DKP-001',
        name: 'Sample Product',
        quantity: 2,
        unitPrice: 750000,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const { baseUrl, apiKey } = context.auth;
    const webhookUrl = context.webhookUrl;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/webhooks`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        event: 'order.created',
        url: webhookUrl,
        status: context.propsValue.status || undefined,
      },
    });

    await context.store.put('webhookId', response.body.id);
  },
  async onDisable(context) {
    const webhookId = await context.store.get('webhookId');
    if (!webhookId) return;

    const { baseUrl, apiKey } = context.auth;
    await httpClient.sendRequest({
      method: HttpMethod.DELETE,
      url: `${baseUrl}/api/v1/webhooks/${webhookId}`,
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
  },
  async run(context) {
    return [context.payload.body];
  },
});
