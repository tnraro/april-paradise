with user := global currentUser
select (
  update Mail
  filter .id = <uuid>$id and not .isReceived and .recipient = user
  set {
    isReceived := true,
  }
).reward
