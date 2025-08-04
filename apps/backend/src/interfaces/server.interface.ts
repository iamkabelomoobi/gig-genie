export interface ServerOptions {
  port?: number;
  syncDatabase?: boolean;
  forceSync?: boolean;
  enableClusterMode?: boolean;
  rateLimitOptions?: {
    windowMs?: number;
    max?: number;
  };
}
