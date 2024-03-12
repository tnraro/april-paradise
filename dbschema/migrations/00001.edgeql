CREATE MIGRATION m12ua76pyiyr2ki6npqbcyjtg7nnse66ym3dm2kxiqurtqjoxldywq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE ABSTRACT TYPE default::User {
      CREATE LINK identity: ext::auth::Identity {
          SET default := (GLOBAL ext::auth::ClientTokenIdentity);
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE ABSTRACT TYPE default::Event {
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY endTime: std::datetime;
      CREATE REQUIRED PROPERTY isEnded := ((std::datetime_of_transaction() > .endTime));
      CREATE REQUIRED PROPERTY startTime: std::datetime;
      CREATE REQUIRED PROPERTY isStarted := ((std::datetime_of_transaction() >= .startTime));
      CREATE REQUIRED PROPERTY isRunning := ((.isStarted AND NOT (.isEnded)));
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE CONSTRAINT std::expression ON ((.startTime < .endTime));
  };
  CREATE TYPE default::GameSession EXTENDING default::Event;
  CREATE GLOBAL default::gameSession := (std::assert_single((SELECT
      default::GameSession
  )));
  CREATE TYPE default::Admin EXTENDING default::User {
      CREATE ACCESS POLICY register_until_session_started
          DENY INSERT USING (((GLOBAL default::gameSession).isStarted ?? false));
      CREATE ACCESS POLICY allow_all
          ALLOW ALL ;
      CREATE REQUIRED PROPERTY isGod: std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::Achievement {
      CREATE REQUIRED PROPERTY condition: std::str {
          CREATE ANNOTATION std::title := '달성 조건';
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY isHidden: std::bool {
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
  CREATE TYPE default::Penalty {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY isBanned: std::bool {
          SET default := false;
      };
      CREATE PROPERTY reason: std::str;
  };
  CREATE TYPE default::RunnerAchievement {
      CREATE REQUIRED LINK achievement: default::Achievement {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY isAdmin := (EXISTS ([IS default::Admin]));
  };
  CREATE TYPE default::Runner EXTENDING default::User {
      CREATE MULTI LINK inventory := (.<owner[IS default::Item]);
      CREATE MULTI LINK penalties := (.<user[IS default::Penalty]);
      CREATE PROPERTY banneds := (std::count((SELECT
          .penalties
      FILTER
          .isBanned
      )));
      CREATE REQUIRED PROPERTY isBanned := ((std::count(.banneds) > 0));
      CREATE REQUIRED PROPERTY isActive := (NOT (.isBanned));
      CREATE PROPERTY warnings := (std::count((SELECT
          .penalties
      FILTER
          NOT (.isBanned)
      )));
      CREATE REQUIRED PROPERTY chips: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY memo: std::str;
      CREATE REQUIRED PROPERTY tokens: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY twitterId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY isRunner := (EXISTS ([IS default::Runner]));
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
