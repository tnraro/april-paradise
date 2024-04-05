// GENERATED by @edgedb/generate v0.4.1

import type {Executor} from "edgedb";

export type PageArgs = {
  "identity": string;
  "key": string;
};

export type PageReturns = {
  "id": string;
};

export async function page(client: Executor, args: PageArgs): Promise<PageReturns> {
  return client.queryRequiredSingle(`\
with identity := (
  select ext::auth::Identity 
  filter .id = <uuid>$identity
)
select (insert User {
  key := <str>$key,
  identity := identity,
  isAdmin := true
})
if not exists (select User filter User.key = <str>$key)
else (
  insert User {
    key := <str>$key ++ <str>random(),
    identity := identity,
    isAdmin := true
  }
)`, args);

}
