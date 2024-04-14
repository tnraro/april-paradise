select (
  update Mail
  filter .id = <uuid>$id
    and not .isReceived
    and .recipient.id = <uuid>$recipient
  set {
    isReceived := true,
  }
).reward
