import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { Config } from 'sst/node/config';
import { fetch } from 'undici';

interface FinancialInstitution {
  id: string;
  name: string;
  logo?: string | null | undefined;
  primary_color?: string | null | undefined;
}

interface FinancialCredentials {
  user_id: number;
  item_id: string;
  access_token: string;
}

interface Database {
  financial_institutions: FinancialInstitution;
  financial_credentials: FinancialCredentials;
}

export const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: Config.DATABASE_URL,
    fetch,
  }),
});
