insert Resource {
  key := <str>$key,
  value := max({ 0, <int64>$value }),
  owner := global currentUser
}
unless conflict on (.owner, .key)
else (
  update Resource
  set {
    value := .value + <int64>$value,
  }
)
