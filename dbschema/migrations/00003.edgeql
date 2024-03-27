CREATE MIGRATION m1tz4jzq2lx7d4li3pvzt2q7r2bhtbjn2hphhnd2jy42autleyh4la
    ONTO m1wk63qxklhm7psvte7fbkzi4g5guo5hdmdtut5oko6x4uc7nmm54q
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          ON TARGET DELETE ALLOW;
      };
  };
};
