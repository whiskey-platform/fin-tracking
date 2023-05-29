import 'reflect-metadata';
import { PlaidService, db, wrapped } from '@fin-tracking/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import Container from 'typedi';
import { validateAuth } from '../../middleware/validate-auth';
import { APIGatewayJSONBodyEventHandler, json } from '../../utils/lambda-utils';
import {
  PostLinkTokensExchangeRequestBody,
  PostLinkTokensExchangeRequestBodyDecoder,
} from '@fin-tracking/defs';
import { validateBody } from '../../middleware/validate-body';
import responseMonitoring from '../../middleware/response-monitoring';

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
      institution_id: institution.institution_id,
    })
    .execute();

  return json({
    itemId: item.item_id,
    institution: {
      id: institution.institution_id,
      name: institution.name,
      logo: institution.logo,
      primaryColor: institution.primary_color,
    },
  });
};

export const handler = wrapped(exchangePublicToken)
  .use(jsonBodyParser())
  .use(validateBody(PostLinkTokensExchangeRequestBodyDecoder))
  .use(validateAuth())
  .use(responseMonitoring());
