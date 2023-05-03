import { Service } from 'typedi';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments } from 'plaid';
import { Config } from 'sst/node/config';

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': Config.PLAID_CLIENT_ID,
      'PLAID-SECRET': Config.PLAID_SECRET,
    },
  },
});
const client = new PlaidApi(configuration);

@Service()
export class PlaidService {
  public async createLinkToken(userId: number) {
    const response = await client.linkTokenCreate({
      client_name: 'whiskey',
      country_codes: [CountryCode.Us],
      language: 'en',
      user: {
        client_user_id: `${userId}`,
      },
    });
    return response.data;
  }
  public async exchangePublicTokenForPrivate(token: string) {
    const response = await client.itemPublicTokenExchange({
      public_token: token,
    });
    return response.data;
  }
  public async getItem(access_token: string) {
    const response = await client.itemGet({
      access_token,
    });
    return response.data.item;
  }
  public async getInstitution(id: string) {
    const response = await client.institutionsGetById({
      country_codes: [CountryCode.Us],
      institution_id: id,
    });
    return response.data.institution;
  }
  public async getAccounts(access_token: string) {
    const response = await client.accountsGet({
      access_token,
    });
    return response.data.accounts;
  }
}
