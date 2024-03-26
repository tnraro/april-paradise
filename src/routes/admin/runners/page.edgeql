select Runner {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity,
}
