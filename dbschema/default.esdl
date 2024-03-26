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
      on target delete delete source;
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

    multi penalties := .<user[is Penalty];
    banneds := count((select .penalties filter .isBanned));
    warnings := count((select .penalties filter not .isBanned));
    required isBanned := count(.banneds) > 0;
    required isActive := not .isBanned;

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

  type Penalty {
    required user: User {
      on target delete delete source;
    }
    reason: str;
    required isBanned: bool {
      default := false;
    };
    trigger log_insert_penalty after insert for each do (
      insert Log {
        table := "Penalty",
        action := "insert",
        patient := __new__.user.key
      }
    );
    trigger log_update_penalty after update for each
    when (__old__.isBanned != __new__.isBanned)
    do (
      insert Log {
        table := "Penalty",
        action := "update",
        patient := __new__.user.key,
        change := <str>__old__.isBanned ++ '->' ++ <str>__new__.isBanned
      }
    );
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
