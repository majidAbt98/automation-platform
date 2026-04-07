import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const lowStockAlertTrigger = createTrigger({
  name: 'low_stock_alert',
  displayName: 'Low Stock Alert',
  description: 'Triggers when a product inventory falls below the threshold',
  auth: digikalaAuth,
  props: {
    threshold: Property.Number({
      displayName: 'Stock Threshold',
      description: 'Trigger when quantity falls below this number',
      required: true,
      defaultValue: 10,
    }),
  },
  sampleData: {
    sku: 'DKP-001',
    productName: 'Sample Product',
    currentStock: 5,
    threshold: 10,
    warehouseId: 'WH-TEHRAN-01',
    alertedAt: new Date().toISOString(),
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const { baseUrl, apiKey } = context.auth;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/webhooks`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        event: 'inventory.low_stock',
        url: context.webhookUrl,
        threshold: context.propsValue.threshold,
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
