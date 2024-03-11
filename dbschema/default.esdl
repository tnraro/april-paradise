using extension auth;

module default {
  global current_user := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );
  global game_session := (
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

    required is_admin := exists [is Admin];
    required is_runner := exists [is Runner];

    required created_at: datetime {
      default := datetime_of_transaction();
    }
  }
  type Admin extending User {
    required is_god: bool {
      default := false;
    }
    access policy allow_all
      allow all;
    access policy register_until_session_started
      deny insert
      using (global game_session.is_started ?? false);
  }
  type Runner extending User {
    required twitter_id: str {
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
    required is_banned := count(.penalties[is Banned]) > 0;
    required is_active := not .is_banned;

    multi achievements := .<runner[is RunnerAchievement];
    multi inventory := .<owner[is Item];
  }

  abstract type Event {
    required name: str;
    description: str;
    required start_time: datetime;
    required end_time: datetime;
    constraint expression on (
      .start_time < .end_time
    );

    required is_started := (
      datetime_of_transaction() >= .start_time
    );
    required is_ended := (
      datetime_of_transaction() > .end_time
    );
    required is_running := (
      .is_started and not .is_ended
    );

    required created_at: datetime {
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

    required created_at: datetime {
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
    required is_hidden: bool {
      annotation title := "히든";
      default := false;
    }

    required created_at: datetime {
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

  abstract type Penalty {
    required user: User {
      on target delete delete source;
    }
    reason: str;
    required is_warning := exists [is Warning];
    required is_banned := exists [is Banned];
  }
  type Warning extending Penalty {}
  type Banned extending Penalty {}
}
