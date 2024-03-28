using extension auth;

module default {
  global currentUser := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  abstract type User {
    identity: ext::auth::Identity{ 
      constraint exclusive;
      on target delete allow;
      default := global ext::auth::ClientTokenIdentity;
    }
    required key: str {
      constraint exclusive;
    }

    required isAdmin := exists [is Admin];
    required isRunner := exists [is Runner];

    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }
  type Admin extending User {
    required isGod: bool {
      default := false;
    }
  }
  type Runner extending User {
    required chips: int64 {
      constraint min_value(0);
      default := 0;
    }
    required tokens: int64 {
      constraint min_value(0);
      default := 0;
    }
    
    trigger log_update_chips after update for each
    when (__old__.chips != __new__.chips)
    do (
      insert Log {
        table := "Runner",
        action := "update",
        patient := __new__.key,
        change := <str>__old__.chips ++ '->' ++ <str>__new__.chips
      }
    );
    trigger log_update_tokens after update for each
    when (__old__.tokens != __new__.tokens)
    do (
      insert Log {
        table := "Runner",
        action := "update",
        patient := __new__.key,
        change := <str>__old__.tokens ++ '->' ++ <str>__new__.tokens
      }
    );

    multi achievements := .<runner[is Achievement];
    multi inventory := .<owner[is Item];

    multi tickets := .<owner[is TicketItem];
    multi fishes := .<owner[is FishItem];
    multi garbages := .<owner[is GarbageItem];
    multi ingredients := .<owner[is IngredientItem];
  }

  type Achievement {
    required runner: Runner {
      default := global currentUser[is Runner];
      on target delete delete source;
    }
    required key: str {
      annotation title := "업적 키";
      constraint exclusive;
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
  }
  type InviteCode {
    required code: uuid {
      default := uuid_generate_v4();
      constraint exclusive;
    }
    required runner: Runner {
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
        patient := __new__.runner.key ++ "<-" ++ <str>__new__.code,
      }
    );
    trigger log_update_invite_code after update for each
    when (__old__.code != __new__.code)
    do (
      insert Log {
        table := "InviteCode",
        action := "update",
        patient := __old__.runner.key,
        change := <str>__old__.code ++ "->" ++ <str>__new__.code,
      }
    );
    trigger log_delete_invite_code after delete for each do (
      insert Log {
        table := "InviteCode",
        action := "delete",
        patient := __old__.runner.key ++ "<-" ++ <str>__old__.code,
      }
    );
  }

  abstract type Item {
    required owner: Runner {
      default := global currentUser[is Runner];
      on target delete delete source;
    }
    required key: str {
      annotation title := "아이템 키";
      constraint exclusive;
    }
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    trigger log_insert_item after insert for each do (
      insert Log {
        table := "Item",
        action := "insert",
        patient := __new__.key,
      }
    );
  }
  type TicketItem extending Item {}
  type FishItem extending Item {}
  type GarbageItem extending Item {}
  type IngredientItem extending Item {}

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
