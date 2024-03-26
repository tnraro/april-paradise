select Runner {
  key,
  id,
  isBanned,
  isActive,
  chips,
  tokens,
  hasIdentity := exists .identity,
  warnings,
  banneds,
}
