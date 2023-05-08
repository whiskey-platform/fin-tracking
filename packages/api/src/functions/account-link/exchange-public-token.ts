import 'reflect-metadata';
import { PlaidService, db } from '@fin-tracking/core';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import Container from 'typedi';
import requestMonitoring from '../../middleware/request-monitoring';
import { validateAuth } from '../../middleware/validate-auth';
import { APIGatewayJSONBodyEventHandler, json } from '../../utils/lambda-utils';
import {
  PostLinkTokensExchangeRequestBody,
  PostLinkTokensExchangeRequestBodyDecoder,
} from '@fin-tracking/defs';
import { validateBody } from '../../middleware/validate-body';

const exchangePublicToken: APIGatewayJSONBodyEventHandler<
  PostLinkTokensExchangeRequestBody
> = async event => {
  const plaid = Container.get(PlaidService);
  const exchangePublicTokenResponse = await plaid.exchangePublicTokenForPrivate(
    event.body.publicToken
  );

  // get institution info
  const item = await plaid.getItem(exchangePublicTokenResponse.access_token);
  const institution = await plaid.getInstitution(item.institution_id!);

  // save to DB
  await db
    .replaceInto('financial_institutions')
    .values({
      id: institution.institution_id,
      name: institution.name,
      logo: institution.logo,
      primary_color: institution.primary_color,
    })
    .execute();
  await db
    .replaceInto('financial_credentials')
    .values({
      user_id: parseInt(event.headers['x-user-id']!),
      item_id: item.item_id,
      access_token: exchangePublicTokenResponse.access_token,
    })
    .execute();

  return json({
    itemId: item.item_id,
    institution: {
      name: institution.name,
      logo: institution.logo,
      primaryColor: institution.primary_color,
    },
  });
};

export const handler = middy(exchangePublicToken)
  .use(requestMonitoring())
  .use(jsonBodyParser())
  .use(validateBody(PostLinkTokensExchangeRequestBodyDecoder))
  .use(validateAuth());
