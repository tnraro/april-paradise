select User {
  key,
  id,
  chips,
  tokens,
  isBanned,
  hasIdentity := exists .identity,
} filter not .isAdmin
