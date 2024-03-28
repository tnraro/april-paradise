select User {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity,
} filter not .isAdmin
