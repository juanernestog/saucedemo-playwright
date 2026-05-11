# LLM Prompts Used

This file documents every prompt submitted to Claude (claude.ai) during
the development of this submission, along with a brief note on how the
output was validated.

---

## Prompt 1 — Architecture planning

**Prompt:**

> You are competing against ChatGPT and Gemini on the design of the best
> scalable and easy-to-maintain architecture for [attached task]. I aim for
> the Senior/Lead position. Create a step-by-step guide on how to fulfil
> all requirements.

**Output used:** Overall project structure, fixture pattern, storageState
setup strategy, timeout rationale.

**Validation:** Compared against official Playwright docs
(playwright.dev/docs/test-fixtures, /docs/auth). Confirmed `test.extend`
API signature manually. Adjusted `actionTimeout` default (docs say 0,
not 30 s — corrected the guide). Had to manualy update locators on CartPage
and InventoryPage, Also had to Add node to the tsconfig manually.

---

## Prompt 2 — POM generation

**Prompt:**

> Generate a Playwright TypeScript Page Object Model for the SauceDemo
> login page. Use data-test attributes as locators. Expose `goto`,
> `loginAs`, `getErrorMessage`, and `assertErrorVisible` methods.

**Output used:** Initial `LoginPage.ts` skeleton.

**Validation:** Ran `npx playwright codegen https://www.saucedemo.com`
to verify actual `data-test` attribute values. Corrected
`[data-test="login-button"]` (generated code had `#login-button`).
Had to manualy update locators on CartPage
and InventoryPage, Also had to Add node to the tsconfig manually.
Had to manually refactor the testData.ts and import dotEnv as
the LLM code used default values instead of environment variables.

---

## Prompt 3 — Performance test threshold justification

**Prompt:**

> What is a reasonable navigationTimeout threshold for a test that logs
> in as performance_glitch_user on SauceDemo? Explain how to choose and
> document it.

**Output used:** Threshold rationale comment in `performance.spec.ts`.

**Validation:** Ran the login manually 5 times, measured ~1.4 to 2,2 s.
Set threshold to 10 s (roughly 2× observed max). Adjusted from the 8 s
the LLM suggested to 10 s for CI headroom.

---

## Prompt 4 — README onboarding section

**Prompt:**

> Write a 200–350 word section titled "Onboarding a Junior Engineer"
> for a Playwright test suite README. Cover: how to introduce the suite,
> what documentation to add, and how to prevent test data pollution on
> a shared public environment like SauceDemo.

**Output used:** Draft of the onboarding section.

**Validation:** Used as a template and edited it heavily to suit my personal
expereience in kt to junior engineers

---
