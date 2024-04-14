CREATE MIGRATION m14jjbzke5yrtvnuc57wfspgeyzpprrr47777m6d3rzhvyd5oztuna
    ONTO m1bvvdjcgy2wepntdc63xfxmrwkryvsyzjx35r6pava2o77gabhlla
{
  ALTER TYPE default::Achievement {
      DROP ACCESS POLICY achievement__admin;
      DROP ACCESS POLICY achievement__banned_runner;
      DROP ACCESS POLICY achievement__self;
  };
  ALTER TYPE default::Item {
      DROP ACCESS POLICY item__admin;
      DROP ACCESS POLICY item__banned_runner;
      DROP ACCESS POLICY item__self;
  };
  ALTER TYPE default::Mail {
      DROP ACCESS POLICY mail__admin;
      DROP ACCESS POLICY mail__banned_runner;
      DROP ACCESS POLICY mail__recipient;
  };
};
