CREATE MIGRATION m1r6tlduqd5rxile5hcmefhu4r26lrmz73lqgzenwjz7bdpkiklh5a
    ONTO m1hbzbz6sqif3jt7xbmtcmbp5e4n3yhu5ysboo4dsxv7exp64syjka
{
  ALTER TYPE default::Item {
      ALTER PROPERTY value {
          RENAME TO quantity;
      };
      ALTER TRIGGER log_update_item USING (INSERT
          default::Log
          {
              table := ('Item::' ++ __new__.category),
              action := 'update',
              patient := __old__.key,
              change := ((<std::str>__old__.quantity ++ '->') ++ <std::str>__new__.quantity)
          });
  };
};
