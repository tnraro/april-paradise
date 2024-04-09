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
        select (
          group .items
          by .key
        ) {
          item := .key.key,
          category := assert_single(distinct .elements.category),
          quantity := count(.elements),
        }
      )
      by .category
    ) {
      category := .key.category,
      items := .elements {
        item,
        category,
        quantity,
      }
    }
  ),
}
filter user.isAdmin
  and .key = <str>$key
  and (not .isAdmin or (.id = user.id))
