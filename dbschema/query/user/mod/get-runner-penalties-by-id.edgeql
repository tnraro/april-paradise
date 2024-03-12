select Runner {
  id,
  penalties: {
    reason,
    id,
    isBanned := .is_banned,
  }
}
filter .id = <std::uuid>$id
