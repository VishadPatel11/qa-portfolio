# QA Automation Portfolio — OWASP Juice Shop

One realistic web app, tested with three UI automation stacks, built up phase by phase toward a full pipeline (API, performance, accessibility, CI/CD, security).

| Folder | Stack | What it shows |
|---|---|---|
| `playwright/` | Playwright + TypeScript | Page Objects, custom fixtures, API-based test setup, data-driven tests, cross-browser |
| `cypress-suite/` | Cypress + JavaScript | Custom commands, API login, network intercepts and waits |
| `selenium-cucumber/` | Selenium 4 + Java + Cucumber (BDD) | Gherkin features, step definitions, Page Objects, explicit waits, screenshots on failure |

**App under test:** [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), a realistic online store that is intentionally insecure, so it also feeds the security work in Phase 6.

---

## 1. One-time setup

Install:
- **Docker Desktop** (runs Juice Shop)
- **Node.js 20+** (Playwright and Cypress)
- **JDK 17+** and **Maven** (Selenium/Cucumber). IntelliJ IDEA Community makes Java much easier.
- **Git**, and a free **GitLab** account (the target job uses GitLab; Phase 5 adds the pipeline)

Start the app:

```bash
docker compose up -d
# open http://localhost:3000 to check it's running
```

Juice Shop keeps its data in memory. `docker compose restart` gives you a clean slate.

## 2. Running each suite

**Playwright**
```bash
cd playwright
npm install
npx playwright install          # downloads the browsers (first time only)
npm test                        # all tests, Chromium + Firefox
npx playwright test --grep @smoke
npm run test:ui                 # interactive mode — great for learning and debugging
npm run report                  # open the HTML report
```

**Cypress**
```bash
cd cypress-suite
npm install
npm run cy:open                 # interactive runner
npm test                        # headless
```

**Selenium + Cucumber**
```bash
cd selenium-cucumber
mvn test                                    # Chrome, with a visible window
mvn test -Dheadless=true -Dbrowser=firefox  # headless Firefox
# report: target/cucumber-report.html
```

All three read `BASE_URL` (default `http://localhost:3000`), so they can point at any environment later.

> If a selector stops matching after a Juice Shop update, open the app, right-click the element → Inspect, and fix the locator in the page object. That's a normal maintenance task, and a good thing to be able to describe in interviews.

---

## 3. Phase 1 plan (about 4 weeks part-time)

The starter tests run as-is. The `TODO` comments are your exercises; doing them yourself is what makes the repo yours and gives you real stories for interviews.

**Week 1 — Playwright basics**
- [ ] Get Juice Shop running and the Playwright suite green
- [ ] Read `fixtures/test.ts` and `utils/api.ts` until you can explain *why* users are created via the API
- [ ] Run `npm run test:ui`, step through a test, look at a trace
- [ ] Exercise: SQL-injection login test (`tests/login.spec.ts`)
- [ ] Exercise: case-insensitive search test (`tests/search.spec.ts`)
- [ ] Commit and push to GitLab

**Week 2 — Playwright depth**
- [ ] Basket exercises: quantity, removal, total calculation (`tests/basket.spec.ts`)
- [ ] Add a mobile viewport project in `playwright.config.ts`
- [ ] New spec: registration through the UI (the one place UI registration belongs), including validation errors
- [ ] Break a test on purpose, then read the HTML report and trace to diagnose it

**Week 3 — Cypress**
- [ ] Get the Cypress suite green
- [ ] Exercise: data-driven invalid logins with a fixture file
- [ ] Exercise: stub the search API with `cy.intercept` and test the "no results" state
- [ ] Write `docs/playwright-vs-cypress.md`: 5–10 bullet points from *your* experience

**Week 4 — Selenium + Cucumber (Java)**
- [ ] Get `mvn test` green
- [ ] Exercise: `search.feature` + `SearchSteps.java` + `SearchPage.java`
- [ ] Add a basket feature that uses a `Background` and a data table
- [ ] Tag scenarios (`@smoke`, `@regression`) and run one tag: `mvn test -Dcucumber.filter.tags="@smoke"`

**Definition of done for Phase 1:** all three suites pass from a clean clone with one command each, the README explains how, and every TODO is done.

---

## 4. Interview talking points this phase gives you

- **Why Page Objects?** Selectors live in one place. When the UI changes you fix one file, not forty tests.
- **Why create test data via the API?** Faster, and a broken registration page fails only the registration test instead of everything.
- **How do you avoid flaky tests?** Wait for conditions (an element, a network response), never for fixed time. Isolate data per test. Retry only in CI, and still investigate anything that needed a retry.
- **Playwright vs Cypress vs Selenium?**
  - Playwright: multiple browsers and tabs, auto-waiting, excellent traces, fast parallel runs.
  - Cypress: great interactive runner and network stubbing; runs inside the browser, which limits multi-tab and multi-domain work.
  - Selenium: the W3C WebDriver standard, every language, huge ecosystem and grid support; more manual waiting.
- **Why BDD/Cucumber?** Feature files are readable by product owners and analysts, so they double as living documentation. The cost is an extra layer to maintain, so keep step definitions thin.
