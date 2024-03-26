CREATE MIGRATION m1g2idmtz7jlppmnkx4wpwcc3cjcpfjxg5l5szl3niv23dnjrw3f5a
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
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE ABSTRACT TYPE default::Item {
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE ANNOTATION std::title := '아이템 키';
      };
  };
  CREATE TYPE default::FishItem EXTENDING default::Item;
  CREATE TYPE default::Runner EXTENDING default::User {
      CREATE REQUIRED PROPERTY chips: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY tokens: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  ALTER TYPE default::Item {
      CREATE REQUIRED LINK owner: default::Runner {
          SET default := ((GLOBAL default::currentUser)[IS default::Runner]);
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  CREATE TYPE default::GarbageItem EXTENDING default::Item;
  CREATE TYPE default::IngredientItem EXTENDING default::Item;
  CREATE TYPE default::TicketItem EXTENDING default::Item;
  CREATE TYPE default::Achievement {
      CREATE REQUIRED LINK runner: default::Runner {
          SET default := ((GLOBAL default::currentUser)[IS default::Runner]);
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE ANNOTATION std::title := '업적 키';
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Log {
      CREATE PROPERTY agent: std::str {
          SET default := ((GLOBAL default::currentUser).key);
      };
      CREATE REQUIRED PROPERTY action: std::str;
      CREATE REQUIRED PROPERTY patient: std::str;
      CREATE REQUIRED PROPERTY table: std::str;
      CREATE PROPERTY change: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  ALTER TYPE default::Runner {
      CREATE MULTI LINK achievements := (.<runner[IS default::Achievement]);
  };
  ALTER TYPE default::Achievement {
      CREATE TRIGGER log_insert_achievement
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'Achievement',
                  action := 'insert',
                  patient := __new__.key
              });
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY isRunner := (EXISTS ([IS default::Runner]));
  };
  CREATE TYPE default::Admin EXTENDING default::User {
      CREATE REQUIRED PROPERTY isGod: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY isAdmin := (EXISTS ([IS default::Admin]));
  };
  ALTER TYPE default::Runner {
      CREATE MULTI LINK fishes := (.<owner[IS default::FishItem]);
      CREATE MULTI LINK garbages := (.<owner[IS default::GarbageItem]);
      CREATE MULTI LINK ingredients := (.<owner[IS default::IngredientItem]);
      CREATE MULTI LINK inventory := (.<owner[IS default::Item]);
      CREATE TRIGGER log_update_chips
          AFTER UPDATE 
          FOR EACH 
              WHEN ((__old__.chips != __new__.chips))
          DO (INSERT
              default::Log
              {
                  table := 'Runner',
                  action := 'update',
                  patient := __new__.key,
                  change := ((<std::str>__old__.chips ++ '->') ++ <std::str>__new__.chips)
              });
      CREATE TRIGGER log_update_tokens
          AFTER UPDATE 
          FOR EACH 
              WHEN ((__old__.tokens != __new__.tokens))
          DO (INSERT
              default::Log
              {
                  table := 'Runner',
                  action := 'update',
                  patient := __new__.key,
                  change := ((<std::str>__old__.tokens ++ '->') ++ <std::str>__new__.tokens)
              });
      CREATE MULTI LINK tickets := (.<owner[IS default::TicketItem]);
  };
  ALTER TYPE default::Item {
      CREATE TRIGGER log_insert_item
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'Item',
                  action := 'insert',
                  patient := __new__.key
              });
  };
};
