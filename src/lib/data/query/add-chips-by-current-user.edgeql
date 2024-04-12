update User
filter .identity = global ext::auth::ClientTokenIdentity
set {
  chips := .chips + <int64>$chips
}
