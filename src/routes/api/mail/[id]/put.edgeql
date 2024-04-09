select (
  update Mail
  filter .id = <uuid>$id and not .isReceived
  set {
    isReceived := true,
  }
).reward
