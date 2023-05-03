import middy, { Request } from '@middy/core';
import { AuthService, logger } from '@fin-tracking/core';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import Container from 'typedi';

const auth = Container.get(AuthService);
export const validateAuth = (): middy.MiddlewareObj<APIGatewayProxyEventV2> => {
  return {
    before: async (request: Request<APIGatewayProxyEventV2>) => {
      logger.info('Validating Auth headers');
      logger.debug('Incoming headers', { headers: request.event.headers });
      try {
        const user = await auth.getUserInfo({
          Authorization: request.event.headers.authorization,
          'x-whiskey-client-id': request.event.headers['x-whiskey-client-id'] ?? '',
          'x-whiskey-client-secret': request.event.headers['x-whiskey-client-secret'] ?? '',
        });

        request.event.headers = {
          ...request.event.headers,
          'x-user-id': `${user.id}`,
        };
      } catch {
        throw {
          status: 401,
          message: 'Invalid Authorization',
        };
      }
    },
  };
};
