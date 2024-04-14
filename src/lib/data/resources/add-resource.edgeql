insert Resource {
  key := <str>$key,
  value := max({ 0, <int64>$value }),
  owner := (select User filter .id = <uuid>$owner)
}
unless conflict on (.owner, .key)
else (
  update Resource
  set {
    value := .value + <int64>$value,
  }
)
