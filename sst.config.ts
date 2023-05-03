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
    });
    app.stack(SecretsStack).stack(API);
  },
} satisfies SSTConfig;
