update User
filter .id = <uuid>$user
set {
  tokens := .tokens + <int64>$tokens
}
