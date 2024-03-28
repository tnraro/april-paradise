select InviteCode {
  key := .user.key
} filter .code = <uuid>$code
