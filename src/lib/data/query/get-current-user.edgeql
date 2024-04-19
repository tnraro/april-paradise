select User {
  id,
  key,
  isAdmin,
  isBanned,
}
filter .identity = global ext::auth::ClientTokenIdentity
