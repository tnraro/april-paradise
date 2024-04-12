with user := global currentUser
select User {
  key,
  id,
  chips,
  tokens,
  isAdmin,
  isBanned,
  hasIdentity := exists .identity,
  mails := .<recipient[is Mail] {
    id,
    sender,
    title,
    isReceived,
    createdAt,
  },
  inventory := (
    select (
      group (
        select .items
        filter .quantity > 0
      )
      by .category
    ) {
      category := .key.category,
      items := .elements {
        item := .key,
        category,
        quantity,
      }
    }
  ),
}
filter user.isAdmin
  and .key = <str>$key
  and (not .isAdmin or (.id = user.id))
