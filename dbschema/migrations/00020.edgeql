CREATE MIGRATION m1bo6zjzb25umjmey4j47kftjio62nptdc3y2polgjaxgtv2crvmvq
    ONTO m1zzkpvsvnz3hhoxsjmcdjfcdxvokbyatfddlqe5fgebh4itq5mcca
{
  ALTER TYPE default::Achievement {
      DROP TRIGGER log_insert_achievement;
  };
  ALTER TYPE default::InviteCode {
      DROP TRIGGER log_delete_invite_code;
      DROP TRIGGER log_insert_invite_code;
      DROP TRIGGER log_update_invite_code;
  };
  ALTER TYPE default::Item {
      DROP TRIGGER log_insert_item;
      DROP TRIGGER log_update_item;
  };
  ALTER TYPE default::Mail {
      DROP TRIGGER log_insert_mail;
      DROP TRIGGER log_update_mail;
  };
  ALTER TYPE default::Resource {
      DROP TRIGGER log_update_item;
  };
  ALTER TYPE default::User {
      DROP TRIGGER log_update_chips;
      DROP TRIGGER log_update_tokens;
  };
};
