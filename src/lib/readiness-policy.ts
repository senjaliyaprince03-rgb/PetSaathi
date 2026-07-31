export type DependencyState =
  | "connected"
  | "configured"
  | "not_configured"
  | "unreachable";

export type ReadinessSnapshot = {
  database: DependencyState;
  auth: DependencyState;
  payments: DependencyState;
};

export function readinessIsAcceptable(
  dependencies: ReadinessSnapshot,
  production: boolean,
) {
  if (dependencies.database === "unreachable") return false;
  if (!production) return true;

  return (
    dependencies.database === "connected" &&
    dependencies.auth === "configured" &&
    dependencies.payments === "configured"
  );
}
