import { createPiece, PieceAuth, Property } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';

import { getOrderAction } from './lib/actions/get-order';
import { getInventoryAction } from './lib/actions/get-inventory';
import { sendNotificationAction } from './lib/actions/send-notification';
import { updateOrderStatusAction } from './lib/actions/update-order-status';
import { newOrderTrigger } from './lib/triggers/new-order';
import { lowStockAlertTrigger } from './lib/triggers/low-stock-alert';

export const digikalaAuth = PieceAuth.CustomAuth({
  description: 'Digikala API Authentication',
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'API Base URL',
      description: 'The base URL of your Digikala API (e.g. https://api.digikala.com)',
      required: true,
      defaultValue: 'https://api.digikala.com',
    }),
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      description: 'Your Digikala platform API key',
      required: true,
    }),
  },
});

export const digikala = createPiece({
  displayName: 'Digikala',
  description: 'Connect to Digikala platform APIs for orders, inventory, notifications and more',
  logoUrl: 'https://www.digikala.com/static/files/3e6e2c55.png',
  minimumSupportedRelease: '0.56.0',
  authors: ['digikala-platform-team'],
  categories: [PieceCategory.COMMERCE],
  auth: digikalaAuth,
  actions: [
    getOrderAction,
    updateOrderStatusAction,
    getInventoryAction,
    sendNotificationAction,
  ],
  triggers: [
    newOrderTrigger,
    lowStockAlertTrigger,
  ],
});
