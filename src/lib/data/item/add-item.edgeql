insert Item {
  key := <str>$key,
  category := <str>$category,
  quantity := max({ 0, <int64>$quantity }),
  owner := (select User filter .id = <uuid>$owner)
}
unless conflict on (.owner, .key)
else (
  update Item
  set {
    quantity := .quantity + <int64>$quantity,
  }
)
