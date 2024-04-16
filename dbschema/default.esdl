using extension auth;

module default {
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
    index on (.isAdmin);
    required isBanned: bool {
      default := false;
    }
    index on (.isBanned);

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
  }

  type Achievement {
    required user: User {
      on target delete delete source;
    }
    required key: str {
      annotation title := "업적 키";
    }

    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    
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
    index on (.isReceived);
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
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
  }

  type Item {
    required owner: User {
      on target delete delete source;
    }
    required key: str;
    required category: str;
    index on (.category);
    required quantity: int64 {
      constraint min_value(0);
      default := 0;
    }
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
    constraint exclusive on ((.owner, .key));
  }
  type Resource {
    required owner: User {
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
    constraint exclusive on ((.owner, .key));
  }

  type Log {
    required table: str;
    required action: str;
    agent: str;
    required patient: str;
    change: str;
    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }
}
