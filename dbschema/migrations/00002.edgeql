CREATE MIGRATION m1ka7h74fvcercc3s6jm4tgc5sfz2pkeppxjpkqcuip2bvlf7nyjyq
    ONTO m1cvplqiaqxzheedpf274prqwg4www4w7f5nznjuzlygfd3ivovb5a
{
  ALTER TYPE default::User {
      DROP LINK fishes;
      DROP LINK garbages;
      DROP LINK ingredients;
      DROP LINK tickets;
  };
  ALTER TYPE default::Item {
      RESET ABSTRACT;
      ALTER PROPERTY key {
          DROP CONSTRAINT std::exclusive;
          DROP ANNOTATION std::title;
      };
      CREATE REQUIRED PROPERTY category: std::str {
          SET REQUIRED USING (<std::str>{});
      };
      ALTER TRIGGER log_insert_item USING (INSERT
          default::Log
          {
              table := ('Item::' ++ __new__.category),
              action := 'insert',
              patient := __new__.key
          });
  };
  DROP TYPE default::FishItem;
  DROP TYPE default::GarbageItem;
  DROP TYPE default::IngredientItem;
  CREATE TYPE default::Resource {
      CREATE REQUIRED LINK owner: default::User {
          SET default := (GLOBAL default::currentUser);
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY key: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.owner, .key));
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY value: std::int64 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
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
  DROP TYPE default::TicketItem;
};
