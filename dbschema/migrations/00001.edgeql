CREATE MIGRATION m1cvplqiaqxzheedpf274prqwg4www4w7f5nznjuzlygfd3ivovb5a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE LINK identity: ext::auth::Identity {
          SET default := (GLOBAL ext::auth::ClientTokenIdentity);
          ON TARGET DELETE ALLOW;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY chips: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY isAdmin: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY isBanned: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY tokens: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE ABSTRACT TYPE default::Item {
      CREATE REQUIRED LINK owner: default::User {
          SET default := (GLOBAL default::currentUser);
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE ANNOTATION std::title := '아이템 키';
      };
  };
  CREATE TYPE default::FishItem EXTENDING default::Item;
  CREATE TYPE default::GarbageItem EXTENDING default::Item;
  CREATE TYPE default::IngredientItem EXTENDING default::Item;
  CREATE TYPE default::TicketItem EXTENDING default::Item;
  CREATE TYPE default::Achievement {
      CREATE REQUIRED LINK user: default::User {
          SET default := (GLOBAL default::currentUser);
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
  ALTER TYPE default::User {
      CREATE MULTI LINK achievements := (.<user[IS default::Achievement]);
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
                  table := 'User',
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
                  table := 'User',
                  action := 'update',
                  patient := __new__.key,
                  change := ((<std::str>__old__.tokens ++ '->') ++ <std::str>__new__.tokens)
              });
      CREATE MULTI LINK tickets := (.<owner[IS default::TicketItem]);
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
  CREATE TYPE default::InviteCode {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY code: std::uuid {
          SET default := (std::uuid_generate_v4());
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE TRIGGER log_delete_invite_code
          AFTER DELETE 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'InviteCode',
                  action := 'delete',
                  patient := ((__old__.user.key ++ '<-') ++ <std::str>__old__.code)
              });
      CREATE TRIGGER log_insert_invite_code
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'InviteCode',
                  action := 'insert',
                  patient := ((__new__.user.key ++ '<-') ++ <std::str>__new__.code)
              });
      CREATE TRIGGER log_update_invite_code
          AFTER UPDATE 
          FOR EACH 
              WHEN ((__old__.code != __new__.code))
          DO (INSERT
              default::Log
              {
                  table := 'InviteCode',
                  action := 'update',
                  patient := __old__.user.key,
                  change := ((<std::str>__old__.code ++ '->') ++ <std::str>__new__.code)
              });
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
};
