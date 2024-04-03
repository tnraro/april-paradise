with item := (
  select Item
  filter .owner = global currentUser and .category = <str>$category
),
grouped := (group item by .key)
select grouped {
  item := .key.key,
  quantity := count(.elements)
}
