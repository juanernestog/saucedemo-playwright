// tests/fixtures/testData.ts
import * as dotenv from 'dotenv';

// Load .env into process.env BEFORE anything reads from it.
// Playwright does not do this automatically.
dotenv.config();

// ─── Guard — fail fast with a clear message if a required var is missing ─────
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to .env and fill in the values.`,
    );
  }
  return value;
}

// ─── Credentials ─────────────────────────────────────────────────────────────

export const USERS = {
  standard: requireEnv('STANDARD_USER'),
  lockedOut: requireEnv('LOCKED_USER'),
  problem: requireEnv('PROBLEM_USER'),
  perfGlitch: requireEnv('PERF_USER'),
  error: requireEnv('ERROR_USER'),
} as const;

export const BASE_URL = requireEnv('BASE_URL');
export const PASSWORD = requireEnv('PASSWORD');
export const WRONG_PASSWORD = requireEnv('WRONG_PASSWORD');

// ─── File paths ───────────────────────────────────────────────────────────────

export const AUTH_FILE = '.auth/user.json' as const;

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack' as const,
  bikeLight: 'Sauce Labs Bike Light' as const,
  boltShirt: 'Sauce Labs Bolt T-Shirt' as const,
} as const;

// ─── Customer info ────────────────────────────────────────────────────────────

export const CUSTOMER = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '10001',
} as const;

// ─── Error messages ───────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  lockedOut: 'Sorry, this user has been locked out',
  wrongCredentials: 'Username and password do not match',
  usernameRequired: 'Username is required',
  firstNameRequired: 'First Name is required',
  lastNameRequired: 'Last Name is required',
} as const;

// ─── Performance thresholds (ms) ─────────────────────────────────────────────

export const TIMEOUTS = {
  // SauceDemo artificially delays performance_glitch_user ~5–6 s.
  // 10 000 ms gives a 4 s CI buffer while still catching real regressions.
  perfGlitchInventoryLoad: 10_000,
} as const;
