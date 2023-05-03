import 'reflect-metadata';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PlaidService } from '@fin-tracking/core';
import Container from 'typedi';
import middy from '@middy/core';
import requestMonitoring from '../../middleware/request-monitoring';
import { validateAuth } from '../../middleware/validate-auth';

const createLinkToken: APIGatewayProxyHandlerV2 = async event => {
  const plaid = Container.get(PlaidService);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const createTokenResponse = await plaid.createLinkToken(parseInt(event.headers['x-user-id']!));
  return {
    statusCode: 200,
    body: JSON.stringify(createTokenResponse),
  };
};
export const handler = middy(createLinkToken).use(requestMonitoring()).use(validateAuth());
