declare module "../../../../../api/routes/dashboard.mjs" {
  export function healthHandler(req: unknown, res: {
    status(code: number): { json(data: unknown): Response };
    json(data: unknown): Response;
  }): Promise<Response>;

  export function metricsHandler(req: { query: { windowMs?: string } }, res: {
    status(code: number): { json(data: unknown): Response };
    json(data: unknown): Response;
  }): Promise<Response>;

  export function governanceHandler(req: { query: { userId?: string } }, res: {
    status(code: number): { json(data: unknown): Response };
    json(data: unknown): Response;
  }): Promise<Response>;

  export function ragHandler(req: { query: { windowMs?: string } }, res: {
    status(code: number): { json(data: unknown): Response };
    json(data: unknown): Response;
  }): Promise<Response>;
}
