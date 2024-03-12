using extension auth;

module default {
  global currentUser := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );
  global gameSession := (
    assert_single((
      select GameSession
    ))
  );

  abstract type User {
    identity: ext::auth::Identity{ 
      constraint exclusive;
      on target delete delete source;
      default := global ext::auth::ClientTokenIdentity;
    }
    required name: str {
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
    access policy allow_all
      allow all;
    access policy register_until_session_started
      deny insert
      using (global gameSession.isStarted ?? false);
  }
  type Runner extending User {
    required twitterId: str {
      constraint exclusive;
    }
    memo: str;

    required chips: int64 {
      constraint min_value(0);
      default := 0;
    }
    required tokens: int64 {
      constraint min_value(0);
      default := 0;
    }

    multi penalties := .<user[is Penalty];
    banneds := count((select .penalties filter .isBanned));
    warnings := count((select .penalties filter not .isBanned));
    required isBanned := count(.banneds) > 0;
    required isActive := not .isBanned;

    multi achievements := .<runner[is RunnerAchievement];
    multi inventory := .<owner[is Item];
  }

  abstract type Event {
    required name: str;
    description: str;
    required startTime: datetime;
    required endTime: datetime;
    constraint expression on (
      .startTime < .endTime
    );

    required isStarted := (
      datetime_of_transaction() >= .startTime
    );
    required isEnded := (
      datetime_of_transaction() > .endTime
    );
    required isRunning := (
      .isStarted and not .isEnded
    );

    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }

  type GameSession extending Event {}

  type RunnerAchievement {
    required runner: Runner {
      on target delete delete source;
    }
    required achievement: Achievement {
      on target delete delete source;
    }

    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }

  type Achievement {
    required name: str {
      annotation title := "업적 명"
    }
    required condition: str {
      annotation title := "달성 조건";
    }
    required reward: str {
      annotation title := "보상";
    }
    required isHidden: bool {
      annotation title := "히든";
      default := false;
    }

    required createdAt: datetime {
      default := datetime_of_transaction();
    }
  }

  abstract type Item {
    required owner: User;
    required name: str {
      annotation title := "아이템 이름 (키)";
    }
    required quantity: int64 {
      annotation title := "아이템 수량";
      constraint min_value(0);
    }
  }

  type Penalty {
    required user: User {
      on target delete delete source;
    }
    reason: str;
    required isBanned: bool {
      default := false;
    };
  }
}
