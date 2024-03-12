select Runner {
  id,
  penalties: {
    reason,
    id,
    isBanned,
  }
}
filter .id = <std::uuid>$id
