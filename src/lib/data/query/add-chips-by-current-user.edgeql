with user := global currentUser
update user
set {
  chips := user.chips + <int64>$chips
}
