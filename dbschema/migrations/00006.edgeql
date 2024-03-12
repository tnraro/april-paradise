CREATE MIGRATION m1gia562gd5ffhx6wj35qhoe2zxu5oztjhc6md54bucau6hoa6vt4a
    ONTO m14rsida27lry32pn4jm5bsgbgn56w37pye7xuqsyuzmv2kpkorhba
{
  ALTER TYPE default::Penalty {
      RESET ABSTRACT;
      DROP PROPERTY is_warning;
      ALTER PROPERTY is_banned {
          SET default := false;
          RESET EXPRESSION;
          RESET CARDINALITY;
          SET TYPE std::bool;
      };
  };
  ALTER TYPE default::Runner {
      CREATE PROPERTY banneds := (std::count((SELECT
          .penalties
      FILTER
          .is_banned
      )));
      ALTER PROPERTY is_banned {
          USING ((std::count(.banneds) > 0));
      };
      CREATE PROPERTY warnings := (std::count((SELECT
          .penalties
      FILTER
          NOT (.is_banned)
      )));
  };
  DROP TYPE default::Warning;
  DROP TYPE default::Banned;
};
