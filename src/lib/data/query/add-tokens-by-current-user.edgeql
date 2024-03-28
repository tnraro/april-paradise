with user := global currentUser
update user
set {
  tokens := user.tokens + <int64>$tokens
}
