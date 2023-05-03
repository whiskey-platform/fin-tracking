import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Config, StackContext } from 'sst/constructs';

export default function SecretsStack({ stack }: StackContext) {
  const DATABASE_URL = new Config.Secret(stack, 'DATABASE_URL');

  const PLAID_CLIENT_ID = new Config.Secret(stack, 'PLAID_CLIENT_ID');
  const PLAID_SECRET = new Config.Secret(stack, 'PLAID_SECRET');

  const apiBaseUrl = StringParameter.valueFromLookup(
    stack,
    `/sst/auth-service/${stack.stage}/Api/api/url`
  );
  const AUTH_BASE_URL = new Config.Parameter(stack, 'AUTH_BASE_URL', {
    value: `${apiBaseUrl}`,
  });

  return {
    DATABASE_URL,
    AUTH_BASE_URL,
    PLAID_CLIENT_ID,
    PLAID_SECRET,
  };
}
