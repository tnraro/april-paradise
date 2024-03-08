module default {
  global current_user := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity {
      constraint exclusive;
      on target delete delete source;
    };
    required name: str;
    multi owned_characters := .<owner[is Character];
  }

  type Character {
    required owner: User {
      on target delete delete source;
    }
    required name: str;
    played_sessions: int64;
    required created_at: datetime {
      default := datetime_of_transaction();
    }
  }
}
