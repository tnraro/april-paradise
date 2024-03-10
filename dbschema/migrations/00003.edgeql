CREATE MIGRATION m1illqailiubvyc4ammglvqqbsfjjw2bfo2rhrc3rj3qcwgywyxqpq
    ONTO m13awh4quaccpriy5wx3c2nafmndrlgboljjjftd5zxojohkwjfbxq
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          RESET OPTIONALITY;
      };
  };
};
