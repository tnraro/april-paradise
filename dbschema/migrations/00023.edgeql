CREATE MIGRATION m1qbltphm3eivmbz2uxrzuamg5i2mzk3o4i6obcikr255whuxbnwfa
    ONTO m15aljqgqnjnj23h7c6udv32w6ye2463fyjd4cqitniiyokxcuf3ca
{
  CREATE GLOBAL default::currentUserId -> std::uuid;
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User
  FILTER
      (.id = GLOBAL default::currentUserId)
  )));
  ALTER TYPE default::Item {
      ALTER LINK owner {
          SET default := (GLOBAL default::currentUser);
      };
      CREATE TRIGGER log_insert_item
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := ('Item::' ++ __new__.category),
                  action := 'insert',
                  patient := __new__.key
              });
      CREATE TRIGGER log_update_item
          AFTER UPDATE 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := ('Item::' ++ __new__.category),
                  action := 'update',
                  patient := __old__.key,
                  change := ((<std::str>__old__.quantity ++ '->') ++ <std::str>__new__.quantity)
              });
  };
  ALTER TYPE default::Resource {
      ALTER LINK owner {
          SET default := (GLOBAL default::currentUser);
      };
      CREATE TRIGGER log_update_item
          AFTER UPDATE 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'Resource',
                  action := 'update',
                  patient := __old__.key,
                  change := ((<std::str>__old__.value ++ '->') ++ <std::str>__new__.value)
              });
  };
  ALTER TYPE default::Achievement {
      ALTER LINK user {
          SET default := (GLOBAL default::currentUser);
      };
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
  ALTER TYPE default::Log {
      ALTER PROPERTY agent {
          SET default := ((GLOBAL default::currentUser).key);
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK achievements := (.<user[IS default::Achievement]);
      CREATE MULTI LINK items := (.<owner[IS default::Item]);
      CREATE TRIGGER log_update_chips
          AFTER UPDATE 
          FOR EACH 
              WHEN ((__old__.chips != __new__.chips))
          DO (INSERT
              default::Log
              {
                  table := 'User',
                  action := 'update',
                  patient := 'chips',
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
                  patient := 'tokens',
                  change := ((<std::str>__old__.tokens ++ '->') ++ <std::str>__new__.tokens)
              });
  };
  ALTER TYPE default::InviteCode {
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
  };
  ALTER TYPE default::Mail {
      CREATE TRIGGER log_insert_mail
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'Mail',
                  action := 'insert',
                  patient := ((__new__.recipient.key ++ '::') ++ __new__.title)
              });
      CREATE TRIGGER log_update_mail
          AFTER UPDATE 
          FOR EACH 
              WHEN ((__old__.isReceived != __new__.isReceived))
          DO (INSERT
              default::Log
              {
                  table := 'Mail',
                  action := 'update',
                  patient := ((__old__.recipient.key ++ '::') ++ __old__.title),
                  change := ((<std::str>__old__.isReceived ++ '->') ++ <std::str>__new__.isReceived)
              });
  };
};
