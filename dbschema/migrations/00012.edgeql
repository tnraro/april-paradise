CREATE MIGRATION m1hbzbz6sqif3jt7xbmtcmbp5e4n3yhu5ysboo4dsxv7exp64syjka
    ONTO m1dqpzdvbp3nwk4f5dx7b4jgee2rmf65ary7ux32fzh73aujfdfeiq
{
  ALTER TYPE default::Item {
      CREATE CONSTRAINT std::exclusive ON ((.owner, .key));
      CREATE REQUIRED PROPERTY value: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE TRIGGER log_update_item
          AFTER UPDATE 
          FOR EACH DO (INSERT
              default::Log
              {
                  table := ('Item::' ++ __new__.category),
                  action := 'update',
                  patient := __old__.key,
                  change := ((<std::str>__old__.value ++ '->') ++ <std::str>__new__.value)
              });
  };
};
