import { db } from '@fin-tracking/core';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import requestMonitoring from '../middleware/request-monitoring';
import middy from '@middy/core';
import { validateAuth } from '../middleware/validate-auth';

const getAccounts: APIGatewayProxyHandlerV2 = async event => {
  const accounts = await db
    .selectFrom('financial_credentials')
    .fullJoin(
      'financial_institutions',
      'financial_institutions.id',
      'financial_credentials.institution_id'
    )
    .select([
      'financial_credentials.item_id as item_id',
      'financial_institutions.id as institution_id',
      'financial_institutions.name as institution_name',
      'financial_institutions.primary_color as institution_primary_color',
      'financial_institutions.logo as institution_logo',
    ])
    .where('financial_credentials.user_id', '=', parseInt(event.headers['x-user-id']!))
    .execute();
  return {
    statusCode: 200,
    body: JSON.stringify(
      accounts.map(val => ({
        itemId: val.item_id,
        institution: {
          id: val.institution_id,
          name: val.institution_name,
          logo: val.institution_logo,
          primaryColor: val.institution_primary_color,
        },
      }))
    ),
  };
};

export const handler = middy(getAccounts).use(requestMonitoring()).use(validateAuth());
