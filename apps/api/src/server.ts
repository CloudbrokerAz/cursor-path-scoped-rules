import { createUserHandler } from "./routes/users";

export function start(): void {
  // Toy entrypoint. Enough of a real file for `apps/api/**` globs to match.
  void createUserHandler;
}
