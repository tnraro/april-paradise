with inviteCode := (select InviteCode
                    filter .code = <uuid>$code),
key := inviteCode.key,
_ := (delete inviteCode limit 1)
select { key };
