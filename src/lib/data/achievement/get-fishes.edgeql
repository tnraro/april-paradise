select Item {
  key,
  category,
  quantity,
}
filter .owner = global currentUser and .category = <str>$category
