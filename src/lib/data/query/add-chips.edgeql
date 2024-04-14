update User
filter .id = <uuid>$user
set {
  chips := .chips + <int64>$chips
}
