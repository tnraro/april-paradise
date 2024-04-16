select (
  update Mail
  filter .id = <uuid>$id
    and not .isReceived
    and .recipient = global currentUser
  set {
    isReceived := true,
  }
).reward
