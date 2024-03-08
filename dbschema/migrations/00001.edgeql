CREATE MIGRATION m1zhytzelpeix46sxus6m2h2jeo4c6irlstvrcfjal7utzknakb36q
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE ABSTRACT TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          SET default := (GLOBAL ext::auth::ClientTokenIdentity);
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE ABSTRACT TYPE default::Event {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY end_time: std::datetime;
      CREATE REQUIRED PROPERTY is_ended := ((std::datetime_of_transaction() > .end_time));
      CREATE REQUIRED PROPERTY start_time: std::datetime;
      CREATE REQUIRED PROPERTY is_started := ((std::datetime_of_transaction() >= .start_time));
      CREATE REQUIRED PROPERTY is_running := ((.is_started AND NOT (.is_ended)));
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE CONSTRAINT std::expression ON ((.start_time < .end_time));
  };
  CREATE TYPE default::GameSession EXTENDING default::Event;
  CREATE GLOBAL default::game_session := (std::assert_single((SELECT
      default::GameSession
  )));
  CREATE TYPE default::Host EXTENDING default::User {
      CREATE ACCESS POLICY register_until_session_started
          DENY INSERT USING (((GLOBAL default::game_session).is_started ?? false));
      CREATE ACCESS POLICY allow_all
          ALLOW ALL ;
  };
  CREATE TYPE default::Achievement {
      CREATE REQUIRED PROPERTY condition: std::str {
          CREATE ANNOTATION std::title := '달성 조건';
      };
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY is_hidden: std::bool {
          SET default := false;
          CREATE ANNOTATION std::title := '히든';
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE ANNOTATION std::title := '업적 명';
      };
      CREATE REQUIRED PROPERTY reward: std::str {
          CREATE ANNOTATION std::title := '보상';
      };
  };
  CREATE TYPE default::RunnerAchievement {
      CREATE REQUIRED LINK achievement: default::Achievement {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  CREATE ABSTRACT TYPE default::Penalty {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY reason: std::str;
  };
  CREATE TYPE default::Banned EXTENDING default::Penalty;
  ALTER TYPE default::Penalty {
      CREATE REQUIRED PROPERTY is_banned := (EXISTS ([IS default::Banned]));
  };
  CREATE TYPE default::Warning EXTENDING default::Penalty;
  ALTER TYPE default::Penalty {
      CREATE REQUIRED PROPERTY is_warning := (EXISTS ([IS default::Warning]));
  };
  CREATE ABSTRACT TYPE default::Item {
      CREATE REQUIRED LINK owner: default::User;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE ANNOTATION std::title := '아이템 이름 (키)';
      };
      CREATE REQUIRED PROPERTY quantity: std::int64 {
          CREATE ANNOTATION std::title := '아이템 수량';
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY is_host := (EXISTS ([IS default::Host]));
  };
  CREATE TYPE default::Runner EXTENDING default::User {
      CREATE MULTI LINK penalties := (.<user[IS default::Penalty]);
      CREATE REQUIRED PROPERTY is_banned := ((std::count(.penalties[IS default::Banned]) > 0));
      CREATE REQUIRED PROPERTY is_active := (NOT (.is_banned));
      CREATE MULTI LINK inventory := (.<owner[IS default::Item]);
      CREATE REQUIRED PROPERTY character: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY chips: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY tokens: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY twitter_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY is_runner := (EXISTS ([IS default::Runner]));
  };
  CREATE TYPE default::GginggoTheGod EXTENDING default::User;
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY is_god := (EXISTS ([IS default::GginggoTheGod]));
  };
  ALTER TYPE default::RunnerAchievement {
      CREATE REQUIRED LINK runner: default::Runner {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Runner {
      CREATE MULTI LINK achievements := (.<runner[IS default::RunnerAchievement]);
  };
};
