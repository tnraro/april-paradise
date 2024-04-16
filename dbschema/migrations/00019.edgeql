CREATE MIGRATION m1zzkpvsvnz3hhoxsjmcdjfcdxvokbyatfddlqe5fgebh4itq5mcca
    ONTO m1ylvvuxb6wh25ehv566he26rr647s2ry52qyhzuywfdbndu2ve7yq
{
  ALTER TYPE default::Log {
      ALTER PROPERTY agent {
          RESET default;
      };
  };
};
