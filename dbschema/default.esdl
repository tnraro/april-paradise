using extension auth;

module default {
  global currentUser := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    identity: ext::auth::Identity { 
      constraint exclusive;
      on target delete allow;
      default := global ext::auth::ClientTokenIdentity;
    }
    required key: str {
      constraint exclusive;
    }

    required isAdmin: bool {
      default := false;
    }
    required isBanned: bool {
      default := false;
    }

    required chips: int64 {
      constraint min_value(0);
      default := 0;
    }
    required tokens: int64 {
      constraint min_value(0);
      default := 0;
    }

    required createdAt: datetime {
      default := datetime_of_transaction();
    }

    trigger log_update_chips after update for each
    when (__old__.chips != __new__.chips)
    do (
      insert Log {
        table := "User",
        action := "update",
        patient := "chips",
        change := <str>__old__.chips ++ '->' ++ <str>__new__.chips
      }
    );
    trigger log_update_tokens after update for each
    when (__old__.tokens != __new__.tokens)
    do (
      insert Log {
        table := "User",
        action := "update",
        patient := "tokens",
        change := <str>__old__.tokens ++ '->' ++ <str>__new__.tokens
      }
    );

    multi achievements := .<user[is Achievement];
    multi inventory := .<owner[is Item];
  }

  type Achievement {
    required user: User {
      default := global currentUser;
      on target delete delete source;
    }
    required key: str {
      annotation title := "업적 키";
    }

    required createdAt: datetime {
      default := datetime_of_transaction();
    }

    trigger log_insert_achievement after insert for each do (
      insert Log {
        table := "Achievement",
        action := "insert",
        patient := __new__.key,
      }
    );
    
    constraint exclusive on ((.user, .key));
  }

  type StaticData {
    required sheet: str {
      constraint exclusive;
    }
    required data: str;
  }

  type Mail {
    required sender: str;
    required recipient: User {
      on target delete delete source;
    }
    required title: str;
    required body: str;
    required reward: str;
    required isReceived: bool {
      default := false;
    }
    required createdAt: datetime {
      default := datetime_of_transaction();
    }

    trigger log_insert_mail after insert for each do (
      insert Log {
        table := "Mail",
        action := "insert",
        patient := __new__.recipient.key ++ "::" ++ __new__.title,
      }
    );
    trigger log_update_mail after update for each
    when (__old__.isReceived != __new__.isReceived)
    do (
      insert Log {
        table := "Mail",
        action := "update",
        patient := __old__.recipient.key ++ "::" ++ __old__.title,
        change := <str>__old__.isReceived ++ "->" ++ <str>__new__.isReceived,
      }
    );
  }

  type InviteCode {
    required code: uuid {
      default := uuid_generate_v4();
      constraint exclusive;
    }
    required user: User {
      constraint exclusive;
      on target delete delete source;
    }
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    trigger log_insert_invite_code after insert for each do (
      insert Log {
        table := "InviteCode",
        action := "insert",
        patient := __new__.user.key ++ "<-" ++ <str>__new__.code,
      }
    );
    trigger log_update_invite_code after update for each
    when (__old__.code != __new__.code)
    do (
      insert Log {
        table := "InviteCode",
        action := "update",
        patient := __old__.user.key,
        change := <str>__old__.code ++ "->" ++ <str>__new__.code,
      }
    );
    trigger log_delete_invite_code after delete for each do (
      insert Log {
        table := "InviteCode",
        action := "delete",
        patient := __old__.user.key ++ "<-" ++ <str>__old__.code,
      }
    );
  }

  type Item {
    required owner: User {
      default := global currentUser;
      on target delete delete source;
    }
    required key: str;
    required category: str;
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    trigger log_insert_item after insert for each do (
      insert Log {
        table := "Item::" ++ __new__.category,
        action := "insert",
        patient := __new__.key,
      }
    );
  }
  type Resource {
    required owner: User {
      default := global currentUser;
      on target delete delete source;
    }
    required key: str;
    required value: int64 {
      constraint min_value(0);
      default := 0;
    }
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    trigger log_update_item after update for each do (
      insert Log {
        table := "Resource",
        action := "update",
        patient := __old__.key,
        change := <str>__old__.value ++ "->" ++ <str>__new__.value,
      }
    );
    constraint exclusive on ((.owner, .key));
  }

  type Log {
    required table: str;
    required action: str;
    agent: str {
      default := global currentUser.key;
    }
    required patient: str;
    change: str;
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }
}
