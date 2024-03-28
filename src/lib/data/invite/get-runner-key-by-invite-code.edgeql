select InviteCode {
  key := .runner.key
} filter .code = <uuid>$code
