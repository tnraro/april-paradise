CREATE MIGRATION m1wk63qxklhm7psvte7fbkzi4g5guo5hdmdtut5oko6x4uc7nmm54q
    ONTO m1g2idmtz7jlppmnkx4wpwcc3cjcpfjxg5l5szl3niv23dnjrw3f5a
{
  CREATE TYPE default::InviteCode {
      CREATE REQUIRED LINK runner: default::Runner {
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
                  patient := ((__old__.runner.key ++ '<-') ++ <std::str>__old__.code)
              });
      CREATE TRIGGER log_insert_invite_code
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'InviteCode',
                  action := 'insert',
                  patient := ((__new__.runner.key ++ '<-') ++ <std::str>__new__.code)
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
                  patient := __old__.runner.key,
                  change := ((<std::str>__old__.code ++ '->') ++ <std::str>__new__.code)
              });
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
};
