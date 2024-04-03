CREATE MIGRATION m1v2xljs4fdztj6lzlksfsm5lhpn4mgixv4g6ngz2f7mjkdlkznfya
    ONTO m1ka7h74fvcercc3s6jm4tgc5sfz2pkeppxjpkqcuip2bvlf7nyjyq
{
  ALTER TYPE default::Achievement {
      CREATE CONSTRAINT std::exclusive ON ((.user, .key));
      ALTER PROPERTY key {
          DROP CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER TRIGGER log_update_chips USING (INSERT
          default::Log
          {
              table := 'User',
              action := 'update',
              patient := 'chips',
              change := ((<std::str>__old__.chips ++ '->') ++ <std::str>__new__.chips)
          });
      ALTER TRIGGER log_update_tokens USING (INSERT
          default::Log
          {
              table := 'User',
              action := 'update',
              patient := 'tokens',
              change := ((<std::str>__old__.tokens ++ '->') ++ <std::str>__new__.tokens)
          });
  };
};
