# Learn QA Automation with OWASP Juice Shop

A hands-on, self-paced project for learning test automation. You test one realistic web app with three popular UI automation stacks, then build up phase by phase to API, performance, accessibility, CI/CD and security testing.

Anyone can use it. Clone it, work through the checklists, and do the `TODO` exercises in the test files. By the end you'll have a working test suite you built and understand yourself.

| Folder | Stack | What it teaches |
|---|---|---|
| `playwright/` | Playwright + TypeScript | Page Objects, custom fixtures, creating test data through the API, data-driven tests, cross-browser runs |
| `cypress-suite/` | Cypress + JavaScript | Custom commands, logging in through the API, waiting on network calls, stubbing the network |
| `selenium-cucumber/` | Selenium 4 + Java + Cucumber (BDD) | Gherkin features, step definitions, Page Objects, explicit waits, screenshots on failure |

**App under test:** [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), a realistic online store that is deliberately insecure. That makes it great for practising functional testing *and* security testing.

---

## 1. One-time setup

Install:
- **Docker Desktop** (runs Juice Shop)
- **Node.js 20+** (Playwright and Cypress)
- **JDK 17+** and **Maven** (Selenium/Cucumber)
- **Git**, and a free **GitHub** account if you want to keep your own copy online and run the tests automatically with GitHub Actions (Phase 5)
- An editor: **VS Code** with the *Playwright Test for VS Code* extension for the JavaScript/TypeScript suites, and **IntelliJ IDEA Community** with the *Cucumber for Java* and *Gherkin* plugins for the Java suite

Start the app:

```bash
docker compose up -d
# open http://localhost:3000 to check it's running
```

Juice Shop keeps its data in memory, so `docker compose restart` gives you a clean slate. Accounts you register disappear on restart.

**Demo account for exploring by hand:** `admin@juice-sh.op` / `admin123`. It's a built-in account in your local copy only; guessing its weak password is one of Juice Shop's security challenges. The automated tests create a fresh user per test instead, so they never share data.

## 2. Running each suite

**Playwright**
```bash
cd playwright
npm install
npx playwright install          # downloads the browsers (first time only)
npm test                        # all tests, all configured browsers
npx playwright test --project=chromium   # one browser only
npx playwright test --grep @smoke        # only tests tagged @smoke
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
mvn test -Dcucumber.filter.tags="@smoke"    # only scenarios tagged @smoke
# report: target/cucumber-report.html
```

All three read `BASE_URL` (default `http://localhost:3000`), so they can point at any environment.

### Troubleshooting

- **A selector stops matching after a Juice Shop update.** Open the app, right-click the element → *Inspect*, and fix the locator in the page object. In VS Code, the Playwright extension's *Pick locator* button does this for you. This is normal test maintenance.
- **"Strict mode violation … resolved to 2 elements".** Your locator matches more than one thing. Make it more specific, for example an exact text match instead of a partial one.
- **Firefox fails to launch on macOS ("Could not find profile folder").** A known local-environment issue on some Macs. Comment out the Firefox project in `playwright.config.ts` and use WebKit (`npx playwright install webkit`) for cross-browser coverage. Firefox works in CI on Linux.

---

## 3. Phase 1 plan: UI automation (about 4 weeks part-time)

The starter tests run as-is. The `TODO` comments in the test files are your exercises; doing them yourself is the point of the project.

**Week 1 — Playwright basics**
- [ ] Get Juice Shop running and the Playwright suite green
- [ ] Read `fixtures/test.ts` and `utils/api.ts` until you can explain *why* users are created through the API
- [ ] Run `npm run test:ui`, step through a test, and look at a trace
- [ ] Exercise: SQL-injection login test (`tests/login.spec.ts`)
- [ ] Exercise: case-insensitive search test (`tests/search.spec.ts`)
- [ ] Commit and push to your own GitHub repo

**Week 2 — Playwright depth**
- [ ] Basket exercises: quantity, removal, total calculation (`tests/basket.spec.ts`)
- [ ] Add a mobile viewport project in `playwright.config.ts`
- [ ] New spec: registration through the UI (the one place UI registration belongs), including validation errors
- [ ] Break a test on purpose, then use the HTML report and trace to diagnose it

**Week 3 — Cypress**
- [ ] Get the Cypress suite green
- [ ] Exercise: data-driven invalid logins with a fixture file
- [ ] Exercise: stub the search API with `cy.intercept` and test the "no results" state
- [ ] Write `docs/playwright-vs-cypress.md`: 5–10 points from *your own* experience

**Week 4 — Selenium + Cucumber (Java)**
- [ ] Get `mvn test` green
- [ ] Exercise: `search.feature` + `SearchSteps.java` + `SearchPage.java`
- [ ] Add a basket feature that uses a `Background` and a data table
- [ ] Tag scenarios (`@smoke`, `@regression`) and run a single tag

**Phase 1 is done when** all three suites pass from a clean clone with one command each, and every TODO is done.

## 4. Roadmap

| Phase | Focus | Tools |
|---|---|---|
| 1 | UI automation | Playwright, Cypress, Selenium, Cucumber |
| 2 | API testing | OpenAPI/Swagger, REST Assured or pytest, Postman + Newman |
| 3 | Performance testing | JMeter |
| 4 | Accessibility (WCAG 2.1 AA / Section 508) | axe-core, NVDA screen reader |
| 5 | Infrastructure and CI/CD | Docker, GitHub Actions, Kubernetes (kind), Ansible |
| 6 | Security basics | OWASP ZAP, Juice Shop challenges |

---

## 5. Key ideas to be able to explain

- **Why Page Objects?** Selectors live in one place. When the UI changes you fix one file, not forty tests.
- **Why create test data through the API?** It's faster, and a broken registration page fails only the registration test instead of everything.
- **Verify your oracle.** A test is only as good as what it checks. Ask "can this assertion ever fail?", and prove it by breaking the test on purpose once.
- **How do you avoid flaky tests?** Wait for conditions (an element, a network response), never for a fixed time. Give each test its own data. Retry only in CI, and still investigate anything that needed a retry.
- **Playwright vs Cypress vs Selenium?**
  - Playwright: multiple browsers and tabs, auto-waiting, excellent traces, fast parallel runs.
  - Cypress: great interactive runner and network stubbing; runs inside the browser, which limits multi-tab and multi-domain work.
  - Selenium: the W3C WebDriver standard, every major language, a huge ecosystem and grid support; more manual waiting.
- **Why BDD/Cucumber?** Feature files are readable by non-programmers, so they double as living documentation. The cost is an extra layer to maintain, so keep step definitions thin.
