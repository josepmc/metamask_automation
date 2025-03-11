import { Then, When, expect } from 'fixtures';

When('the user clicks the Submit button', async ({ ctx }) => {
  // Step: And the user clicks the Submit button
  // From: features/02-search-erc20-token.feature:7:5
  await ctx.app.tokenInput.submit();
});

Then('the submit button is disabled', async ({ ctx }) => {
  // Step: Then the submit button is disabled
  // From: features/02-search-erc20-token.feature:15:5
  expect(await ctx.app.tokenInput.isSubmitEnabled()).toBe(false);
});

When('the user clicks the example token link', async ({ ctx }) => {
  // Step: And the user clicks the example token link
  // From: features/02-search-erc20-token.feature:20:5
  await ctx.app.tokenInput.exampleToken();
  await ctx.app.deposit.waitFor();
});

Then('the page shows the address balance for the selected token', async ({ ctx }) => {
  // Step: Then the page shows the address balance for the selected token
  // From: features/02-search-erc20-token.feature:8:5
  expect(await ctx.app.deposit.isAddressBalanceVisible()).toBe(true);
});

Then('the page shows the table of the deposit history for the selected token', async ({ ctx }) => {
  // Step: And the page shows the table of the deposit history for the selected token
  // From: features/02-search-erc20-token.feature:9:5
  expect(await ctx.app.deposit.isDepositHistoryVisible()).toBe(true);
});
