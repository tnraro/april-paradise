CREATE MIGRATION m1b3tre6s4rxxi2vml7hp5yoqji6ec5nbe3oxb7pm2yzorfwg5zkqa
    ONTO m123uzlk5zpncfx4dvekqnq56mnzmgcz3lczwk6sf2jdwjbnz7st6a
{
  ALTER TYPE default::Account RENAME TO default::User;
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
