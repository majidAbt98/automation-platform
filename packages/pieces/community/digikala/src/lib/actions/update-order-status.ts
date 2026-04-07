import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const updateOrderStatusAction = createAction({
  name: 'update_order_status',
  displayName: 'Update Order Status',
  description: 'Update the status of an order in Digikala OMS',
  auth: digikalaAuth,
  props: {
    orderId: Property.ShortText({
      displayName: 'Order ID',
      description: 'The unique identifier of the order',
      required: true,
    }),
    status: Property.StaticDropdown({
      displayName: 'New Status',
      description: 'The new status to set for the order',
      required: true,
      options: {
        options: [
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Processing', value: 'PROCESSING' },
          { label: 'Shipped', value: 'SHIPPED' },
          { label: 'Delivered', value: 'DELIVERED' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Returned', value: 'RETURNED' },
        ],
      },
    }),
    note: Property.LongText({
      displayName: 'Note',
      description: 'Optional note about the status change',
      required: false,
    }),
  },
  async run(context) {
    const { orderId, status, note } = context.propsValue;
    const { baseUrl, apiKey } = context.auth;

    const response = await httpClient.sendRequest({
      method: HttpMethod.PUT,
      url: `${baseUrl}/api/v1/orders/${orderId}/status`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: { status, note },
    });

    return response.body;
  },
});
