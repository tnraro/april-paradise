with user := global currentUser
select User {
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
        key,
        category,
        quantity,
      }
    }
  ),
}
filter .id = user.id
