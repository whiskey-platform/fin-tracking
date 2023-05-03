import { MiddlewareObj } from '@middy/core';
import { logger } from '@fin-tracking/core';
import { Decoder } from '@fin-tracking/defs';
import { APIGatewayJSONBodyEvent } from '../utils/lambda-utils';

export function validateBody<S>(decoder: Decoder<S>): MiddlewareObj<APIGatewayJSONBodyEvent<S>> {
  return {
    before: async request => {
      try {
        logger.info('Validating request body');
        decoder.decode(request.event.body);
      } catch (err) {
        logger.info('Error validating request body', { error: err });
        const error = err as Error;
        throw {
          message: 'Validation error',
          status: 400,
          cause: error.message,
        };
      }
    },
  };
}
