with inviteCode := (select InviteCode
                    filter .code = <uuid>$code),
runner := (select Runner
           filter .key = inviteCode.key),
identity := (select ext::auth::Identity 
             filter .id = <uuid>$identity),
_delete_factor := (delete ext::auth::Factor
                  filter .identity = runner.identity),
_delete_identity := (delete runner.identity),
_delete_invite_code := (delete inviteCode)
update runner
set {
  identity := identity,
}
