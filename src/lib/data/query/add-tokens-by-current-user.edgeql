update User
filter .identity = global ext::auth::ClientTokenIdentity
set {
  tokens := .tokens + <int64>$tokens
}
