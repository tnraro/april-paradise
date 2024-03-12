select Runner {
  name,
  memo,
  id,
  isBanned := .is_banned,
  isActive := .is_active,
  chips,
  tokens,
  twitterId := .twitter_id,
  penalties: {
    reason,
    isBanned := .is_banned,
    id
  },
  hasIdentity := exists .identity
}
filter .name = <str>$name