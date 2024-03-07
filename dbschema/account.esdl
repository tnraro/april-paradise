module default {
  type Account {
    required identity: ext::auth::Identity {
      constraint exclusive;
      on target delete delete source;
    };
    required name: str;
    multi owned_characters := .<owner[is Character];
  }

  type Character {
    required owner: Account {
      on target delete delete source;
    }
    required name: str;
    played_sessions: int64;
    required created_at: datetime {
      default := datetime_of_transaction();
    }
  }
}
