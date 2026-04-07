import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const getOrderAction = createAction({
  name: 'get_order',
  displayName: 'Get Order',
  description: 'Retrieve an order by its ID from Digikala OMS',
  auth: digikalaAuth,
  props: {
    orderId: Property.ShortText({
      displayName: 'Order ID',
      description: 'The unique identifier of the order',
      required: true,
    }),
  },
  async run(context) {
    const { orderId } = context.propsValue;
    const { baseUrl, apiKey } = context.auth;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${baseUrl}/api/v1/orders/${orderId}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.body;
  },
});
