select User {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity
}
filter .key = <str>$key and not .isAdmin