// GENERATED by @edgedb/generate v0.4.1

import type {Executor} from "edgedb";


export type LayoutReturns = {
  "key": string;
  "tokens": number;
  "chips": number;
  "isAdmin": boolean;
} | null;

export async function layout(client: Executor): Promise<LayoutReturns> {
  return client.querySingle(`\
select global currentUser {
  key,
  tokens,
  chips,
  isAdmin,
}`);

}
