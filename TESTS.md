# Automated Tests

We use Jest to verify the core financial math of the Audit Engine. This ensures that refactoring the UI or adding new tools never breaks the savings logic that Credex relies on.

## Running Tests

Run the full test suite locally:
```bash
npm test
```

## Test Coverage

### `src/lib/__tests__/audit-engine.test.ts`
Tests the core deterministic logic in `runAudit`.

1. **Flags single user on Team plan as oversized**
   - **Covers:** Validates that `ChatGPT Team` with 1 seat is flagged, and the recommendation correctly calculates savings by switching to `ChatGPT Plus`.
2. **Detects redundancy between Cursor and Copilot**
   - **Covers:** Validates the redundancy rule. If a user has both an AI IDE (Cursor) and an autocomplete tool (Copilot), it recommends canceling Copilot and calculates the $10/mo savings.
3. **Detects API overspend for non-developers**
   - **Covers:** Validates use-case matching. If a non-developer ("writing" use case) is using raw API access (e.g. Anthropic API) with high spend, it recommends moving to the retail SaaS product (Claude Pro) to save money.
4. **Sets isAlreadyOptimal to true when all tools are optimal**
   - **Covers:** Ensures the engine doesn't manufacture fake savings if the user's stack is genuinely lean and appropriate.
5. **Sets hasHighSavings flag correctly at $500 threshold**
   - **Covers:** Verifies that the `$500/mo` threshold flag (`hasHighSavings`) triggers correctly, which controls the visibility of the Credex upsell CTA on the results page.
