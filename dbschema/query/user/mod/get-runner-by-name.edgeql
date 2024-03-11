select Runner {
  name,
  memo,
  id,
  is_banned,
  is_active,
  chips,
  tokens,
  twitter_id,
  penalties: {
    reason,
    is_banned,
    is_warning,
    id
  },
  has_identity := exists .identity
}
filter .name = <str>$name