CREATE MIGRATION m1qyvutthy2mpqyk57ye6v4y3lxlkb2riz53vaiqlxcvhu7b4c3rwq
    ONTO m1s5ot4zbqq7e2yi4lpnemefvtzkh6nejxvcbdl5y6isdqgphwec3a
{
  CREATE TYPE default::Mail {
      CREATE REQUIRED LINK recipient: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE TRIGGER log_insert_mail
          AFTER INSERT 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := 'Mail',
                  action := 'insert',
                  patient := ((__new__.recipient.key ++ '::') ++ __new__.title)
              });
      CREATE REQUIRED PROPERTY isReceived: std::bool {
          SET default := false;
      };
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
      CREATE REQUIRED PROPERTY body: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY reward: std::str;
      CREATE REQUIRED PROPERTY sender: std::str;
  };
};
