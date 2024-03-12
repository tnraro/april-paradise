CREATE MIGRATION m1won7qwjnh5dehrtfj63zq2adsmpl5cybwzaro3qke73o56tw6zia
    ONTO m1illqailiubvyc4ammglvqqbsfjjw2bfo2rhrc3rj3qcwgywyxqpq
{
  ALTER TYPE default::Runner {
      DROP PROPERTY character;
  };
  ALTER TYPE default::Runner {
      CREATE PROPERTY memo: std::str;
  };
};
