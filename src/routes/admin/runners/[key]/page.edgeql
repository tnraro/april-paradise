select Runner {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity
}
filter .key = <str>$key