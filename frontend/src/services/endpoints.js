/**
 * Centralized API endpoint paths.
 * Keep all backend route paths here — never hardcode them in components.
 */
export const ENDPOINTS = {
  // Health
  HEALTH: '/health',
  HEALTH_READY: '/health/ready',

  // Example CRUD resource
  EXAMPLES: '/examples',
  EXAMPLE_BY_ID: (id) => `/examples/${id}`,
};
