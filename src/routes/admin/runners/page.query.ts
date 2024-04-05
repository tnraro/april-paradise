// GENERATED by @edgedb/generate v0.4.1

import type {Executor} from "edgedb";


export type PageReturns = {
  "key": string;
  "id": string;
  "chips": number;
  "tokens": number;
  "hasIdentity": boolean;
}[];

export async function page(client: Executor): Promise<PageReturns> {
  return client.query(`\
select User {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity,
} filter not .isAdmin`);

}
