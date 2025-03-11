import { Then, When, expect } from 'fixtures';

When('the user enters the address {string} in the input address field', async ({ ctx }, address: string) => {
  // Step: And the user enters the address 0xCD85B9a767eF2277E264A4B9A14a2deACAB82FfB in the input address field
  // From: features/03-deposit-erc20-token.feature:6:5
  await ctx.app.tokenInput.inputAddress(address);
});

Then('the page shows the token balance {int}', async ({ ctx }, value: number) => {
  // Step: Then the page shows the token balance 0
  // From: features/03-deposit-erc20-token.feature:8:5
  await ctx.app.deposit.waitForTokenBalance(value.toString());
  expect(await ctx.app.deposit.getTokenBalance()).toBe(value);
});

Then('the deposit input shows an error', async ({ ctx }) => {
  // Step: And the deposit input shows an error
  // From: features/03-deposit-erc20-token.feature:9:5
  expect(await ctx.app.deposit.isDepositInputErrorVisible()).toBe(true);
});

Then('the deposit button is visible', async ({ ctx }) => {
  // Step: Then the deposit button is visible
  // From: features/03-deposit-erc20-token.feature:18:5
  await ctx.app.deposit.waitForDepositButton();
  expect(await ctx.app.deposit.isDepositButtonVisible()).toBe(true);
});

Then('the deposit button is not visible', async ({ ctx }) => {
  // Step: And the deposit button is not visible
  // From: features/03-deposit-erc20-token.feature:10:5
  expect(await ctx.app.deposit.isDepositButtonVisible()).toBe(false);
});

When('the user clicks the deposit button', async ({ ctx }) => {
  // Step: And the user clicks the deposit button
  // From: features/03-deposit-erc20-token.feature:26:5
  await ctx.app.deposit.deposit();
});

When('the user enter the max amount of tokens in the amount field', async ({ ctx }) => {
  // Step: And the user enter the max amount of tokens in the amount field
  // From: features/03-deposit-erc20-token.feature:25:5
  const balance = await ctx.app.deposit.getTokenBalance();
  await ctx.app.deposit.inputDepositAmount(balance);
});

When('the user clicks the Get more tokens link', async ({ ctx }) => {
  // Step: And the user clicks the Get more tokens link
  // From: features/03-deposit-erc20-token.feature:16:5
  // If we load the page too quickly, then it will only give 1e-16 tokens
  // TODO: This is a bad practice, but there's no other way to do it
  await new Promise(resolve => setTimeout(resolve, 5000));
  await ctx.app.deposit.getMoreTokens();
});

When('the user accepts the transaction', async ({ ctx }) => {
  // Step: And the user accepts the transaction
  // From: features/03-deposit-erc20-token.feature:17:5
  const transaction = await ctx.extension.getTransactionRequestScreen();
  const amount = await transaction.getSimulatedAmount();
  expect(amount).toBe('+ 100');
  await transaction.continue();
});

When('the user approve the deposit', async ({ ctx }) => {
  // Step: And the user approve the deposit
  // From: features/03-deposit-erc20-token.feature:27:5
  const request = await ctx.extension.getSpendingCapRequest();
  await request.continue();
  const transaction = await ctx.extension.getApproveTransactionScreen();
  const amount = await transaction.getTransactionAmount();
  expect(amount).toBe('- 100');
  await transaction.continue();
});
