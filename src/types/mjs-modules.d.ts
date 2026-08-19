declare module "*.mjs" {
  export const getAuditMetrics: (...args: any[]) => any;
  export const rateLimiter: {
    checkRateLimit: (...args: any[]) => any;
  };
  export const concurrencyController: {
    tryAcquire: (...args: any[]) => any;
    release: (...args: any[]) => any;
  };
  export const budgetStore: {
    checkBudget: (...args: any[]) => any;
  };
  export const getHealthSnapshot: (...args: any[]) => any;
  export const healthHandler: (...args: any[]) => any;
  export const metricsHandler: (...args: any[]) => any;
  export const governanceHandler: (...args: any[]) => any;
  export const ragHandler: (...args: any[]) => any;
}
