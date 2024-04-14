select (
  select User filter .identity = global ext::auth::ClientTokenIdentity
).id
