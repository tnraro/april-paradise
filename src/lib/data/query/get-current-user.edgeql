select User {
  id,
  isAdmin,
  isBanned,
}
filter .identity = global ext::auth::ClientTokenIdentity
