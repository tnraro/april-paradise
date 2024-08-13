import pkg from "pg";

export function constraintError(constraint: string) {
  const error = new pkg.DatabaseError("", 0, "error");
  error.constraint = constraint;
  throw error;
}
