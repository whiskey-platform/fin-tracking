import { SSTConfig } from 'sst';
import { API } from './stacks/MyStack';
import SecretsStack from './stacks/Secrets';

export default {
  config(_input) {
    return {
      name: 'fin-tracking',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      nodejs: {
        esbuild: {
          external: !app.local ? ['@aws-sdk/*', '@aws-lambda-powertools/*'] : undefined,
        },
      },
      environment: {
        POWERTOOLS_SERVICE_NAME: 'whiskey_fin_tracking_service',
      },
      layers: [`arn:aws:lambda:${app.region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:11`],
    });
    app.stack(SecretsStack).stack(API);
  },
} satisfies SSTConfig;
