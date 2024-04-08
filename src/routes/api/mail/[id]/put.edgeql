with user := global currentUser,
select (
  update Mail
  filter .id = <uuid>$id and .recipient = user and not .isReceived
  set {
    isReceived := true,
  }
).reward
