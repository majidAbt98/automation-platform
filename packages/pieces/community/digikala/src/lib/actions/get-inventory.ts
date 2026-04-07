import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const getInventoryAction = createAction({
  name: 'get_inventory',
  displayName: 'Get Inventory',
  description: 'Get current inventory levels for a product SKU',
  auth: digikalaAuth,
  props: {
    sku: Property.ShortText({
      displayName: 'SKU',
      description: 'Product Stock Keeping Unit identifier',
      required: true,
    }),
    warehouseId: Property.ShortText({
      displayName: 'Warehouse ID',
      description: 'Filter by specific warehouse (leave empty for all)',
      required: false,
    }),
  },
  async run(context) {
    const { sku, warehouseId } = context.propsValue;
    const { baseUrl, apiKey } = context.auth;

    const params = new URLSearchParams({ sku });
    if (warehouseId) params.append('warehouseId', warehouseId);

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${baseUrl}/api/v1/inventory?${params.toString()}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.body;
  },
});
