# SauceDemo Playwright Suite

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com)
built with **Playwright** and **TypeScript**.

---

## Prerequisites

| Requirement | Version                  |
| ----------- | ------------------------ |
| Node.js     | ≥ 18.x (LTS recommended) |
| npm         | bundled with Node        |

```bash
# Install dependencies
npm install

## Install Playwright browser binaries (required once per machine / CI image)
# Linux or Mac OS
npx playwright install chromium firefox --with-deps
# Windows (there is a known issue with Windows and the --with-deps flag may
# need to manually download the binaries of the required browsers if download
# gets stuck on 100% consistently)
npx playwright install chromium firefox
```

---

## Running Tests

```bash
# Run the full suite (Chromium + Firefox, parallel)
npx playwright test

# Run a single spec file
npx playwright test tests/auth/login.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "checkout"

# Run only on one browser
npx playwright test --project=chromium

# Run in headed mode (useful for local debugging)
npx playwright test --headed

# Run in debug mode is headed and can run script step by step
npx playwright test --debug --last-failed
```

Expected output:  
Green ticks per test, followed by a summary line such as  
`37 passed (42s)` and a path to the HTML report.

---

## Viewing the HTML Report

```bash
npx playwright show-report
```

This opens the report at `playwright-report/index.html` in your browser.

---

## Design Decisions

**Page Object Model structure:** Each page in SauceDemo has a single
corresponding class in `src/pages/`. POMs expose _behaviour_ (e.g.,
`loginAs`, `addToCartByName`) rather than raw locators, so test files
read like English and remain resilient to selector changes. A barrel
export (`src/pages/index.ts`) keeps imports clean across the project.

**Test isolation:** Tests that exercise the login flow override
`storageState` to `{ cookies: [], origins: [] }` so they start with a
blank session. All other tests restore a pre-authenticated session from
`.auth/user.json`, which is produced by the `setup` project before any
browser project runs. This eliminates repeated logins without coupling
tests to each other's side-effects.

**Custom fixtures:** `src/fixtures/index.ts` extends Playwright's `test`
object to inject typed POM instances into every test. This is the idiomatic
equivalent of a Cucumber World — shared, lazy, auto-torn-down context.

**Timeout values:** `actionTimeout` is set to 10 s (default 30 s) because
SauceDemo is a static demo app; any interaction taking longer than 10 s
indicates a real problem. `navigationTimeout` stays at 30 s to accommodate
the artificial delay introduced by `performance_glitch_user`.
`retries: 1` is enabled only in CI (`process.env.CI`) to absorb transient
network issues without masking real failures locally.

**Trade-offs:** Given the time constraint, visual regression tests for
`problem_user` are out of scope; assertions are limited to DOM state.
Adding Percy or Playwright's built-in snapshot diffing would close this gap.

---

## Onboarding a Junior Engineer

First set up the dependencies from the "Prerequisites" section above.
After a successful set up ask them to run `npx playwright test --debug --grep "checkout"`
and tell them to manually see the flow. Watching the browser automate
A real flow builds intuition faster than any document.
After that, I walk through `src/pages/LoginPage.ts` together, drawing
the parallel to Selenium's PageObject pattern if they have experience
with Selenium if not explaining that Pages house the locators and actions,
tests contain the calls to the actions on those locators. and the assertions
on the outcomes of those actions.

Confirm their knowledge on our naming conventions preferably the framework
would have configured a Linter that enforces the naming conventions automatically
(spec files end in `.spec.ts`, POM files match the page name exactly, fixture names are
camelCase nouns). I would give them a 1 story point story after the basic kt and ask them
to write down their questions as practice will make them understand enough to ask the questions
they need to better learn the framework.

To prevent test data pollution in a shared public environment,
I would establish three rules. First, every test that modifies
state (adds to cart, starts checkout) must clean up in a
`test.afterEach` block or start from a known URL via `page.goto`. Second,
we never hard-code product names in multiple places — constants live in
`tests/fixtures/testData.ts` so a single change propagates everywhere.
Third, each test is designed to be independent: if it fails halfway
through, the next run must succeed without manual intervention. For a
real application with a writable back-end this would mean API-level
teardown hooks; for SauceDemo, navigating to a clean URL is sufficient.
I run a monthly "test hygiene" session where the junior and I audit
`beforeEach`/`afterEach` blocks together, which doubles as an opportunity
to discuss _why_ isolation matters, not just _how_ to enforce it.
