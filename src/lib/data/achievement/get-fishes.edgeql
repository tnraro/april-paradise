select Item {
  key,
  category,
  quantity,
}
filter .owner.id = <uuid>$owner and .category = <str>$category
