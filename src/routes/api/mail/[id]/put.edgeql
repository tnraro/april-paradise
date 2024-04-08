with user := global currentUser,
update Mail
filter .id = <uuid>$id and .recipient = user
set {
  isReceived := true,
}
