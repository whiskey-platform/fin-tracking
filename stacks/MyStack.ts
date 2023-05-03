import { StackContext, Api, use, ApiDomainProps } from 'sst/constructs';
import SecretsStack from './Secrets';
import { DomainName } from '@aws-cdk/aws-apigatewayv2-alpha';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export function API({ stack, app }: StackContext) {
  const { DATABASE_URL, AUTH_BASE_URL, PLAID_CLIENT_ID, PLAID_SECRET } = use(SecretsStack);

  let customDomain: ApiDomainProps | undefined;
  if (!app.local && app.stage !== 'local') {
    customDomain = {
      path: 'receipts',
      cdk: {
        domainName: DomainName.fromDomainNameAttributes(stack, 'ApiDomain', {
          name: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-api-infra-Infra/domainName`
          ),
          regionalDomainName: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-api-infra-Infra/regionalDomainName`
          ),
          regionalHostedZoneId: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-api-infra-Infra/regionalHostedZoneId`
          ),
        }),
      },
    };
  }

  const api = new Api(stack, 'api', {
    routes: {
      'POST /link-tokens/create':
        'packages/api/src/functions/account-link/create-link-token.handler',
      'POST /link-tokens/exchange':
        'packages/api/src/functions/account-link/exchange-public-token.handler',
    },
  });

  api.bind([AUTH_BASE_URL, DATABASE_URL, PLAID_CLIENT_ID, PLAID_SECRET]);

  return { api };
}
