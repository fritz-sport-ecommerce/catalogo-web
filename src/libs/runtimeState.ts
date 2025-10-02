// Runtime-only in-memory state. Works in a single server instance.
// Note: In serverless deployments with multiple instances, this may not be consistent across instances.
export const lastVerifiedCodes = new Map<string, number>();
