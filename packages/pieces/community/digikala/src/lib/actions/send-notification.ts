import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { digikalaAuth } from '../../index';

export const sendNotificationAction = createAction({
  name: 'send_notification',
  displayName: 'Send Customer Notification',
  description: 'Send an SMS or push notification to a customer via Digikala notification service',
  auth: digikalaAuth,
  props: {
    customerId: Property.ShortText({
      displayName: 'Customer ID',
      description: 'The Digikala customer ID',
      required: true,
    }),
    channel: Property.StaticDropdown({
      displayName: 'Notification Channel',
      description: 'How to deliver the notification',
      required: true,
      options: {
        options: [
          { label: 'SMS', value: 'SMS' },
          { label: 'Push Notification', value: 'PUSH' },
          { label: 'Email', value: 'EMAIL' },
          { label: 'In-App', value: 'IN_APP' },
        ],
      },
    }),
    title: Property.ShortText({
      displayName: 'Title',
      description: 'Notification title (for push/email)',
      required: false,
    }),
    message: Property.LongText({
      displayName: 'Message',
      description: 'The notification message body',
      required: true,
    }),
    templateId: Property.ShortText({
      displayName: 'Template ID',
      description: 'Optional pre-defined message template ID',
      required: false,
    }),
  },
  async run(context) {
    const { customerId, channel, title, message, templateId } = context.propsValue;
    const { baseUrl, apiKey } = context.auth;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/api/v1/notifications`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: { customerId, channel, title, message, templateId },
    });

    return response.body;
  },
});
