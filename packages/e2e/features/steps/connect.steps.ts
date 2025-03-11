import { Given, Then, Before, When, expect } from 'fixtures';

Before(async ({ setupAuthWallet }) => {
  await setupAuthWallet();
});

Given('A user with metamask installed connected to {string} network', async ({ ctx }, network: string) => {
  let transformedNetwork = '';
  switch (network) {
    case 'mainnet':
      transformedNetwork = 'Ethereum Mainnet';
      break;
    case 'sepolia':
      transformedNetwork = 'Sepolia';
      break;
  }
  await ctx.extension.page.bringToFront();
  const networkSelector = await ctx.extension.openNetworkSelector();
  await networkSelector.selectNetwork(transformedNetwork);
});

When('the user accesses the app page', async ({ ctx }) => {
  await ctx.app.page.bringToFront();
  await ctx.app.goto();
  // Connect to the website
  expect(await ctx.app.isLoggedIn()).toBe(false);
  const connect = await ctx.extension.getConnectScreen();
  await connect.continue();
  expect(await ctx.app.isLoggedIn()).toBe(true);
});

When('the user accepts notifications', async ({ ctx }) => {
  // Step: And the user accepts notifications
  // From: features/01-app-access.feature:6:5
  await ctx.app.acceptNotifications();
});

Then('the page shows the account address', async ({ ctx }) => {
  // Step: Then the page shows the account address
  // From: features/01-app-access.feature:7:5
  const appAddress = await ctx.app.tokenInput.getAddress();
  await ctx.extension.copyAddressClipboard();
  // Need to read the clipboard from the app as Lavamoat doesn't allow to read the clipboard from the extension
  const extensionAddress: string = await ctx.app.getClipboard();
  expect(appAddress.toLowerCase()).toBe(extensionAddress.toLowerCase());
});

Then('the page shows the input address field', async ({ ctx }) => {
  // Step: And the page shows the input address field
  // From: features/01-app-access.feature:8:5
  expect(await ctx.app.tokenInput.isAddressInputVisible()).toBe(true);
});

Then("the page doesn't show the input address field", async ({ ctx }) => {
  // Step: And the page doesn't show the input address field
  // From: features/01-app-access.feature:16:5
  expect(await ctx.app.tokenInput.isAddressInputVisible()).toBe(false);
});

Then('the page shows a network error message', async ({ ctx }) => {
  // Step: Then the page shows a network error message
  // From: features/01-app-access.feature:14:5
  expect(await ctx.app.tokenInput.isNetworkErrorVisible()).toBe(true);
});

Then("the page doesn't show a network error message", async ({ ctx }) => {
  // Step: And the page doesn't show a network error message
  // From: features/01-app-access.feature:9:5
  expect(await ctx.app.tokenInput.isNetworkErrorVisible()).toBe(false);
});

Then('the page shows the switch network button', async ({ ctx }) => {
  // Step: And the page shows the switch network button
  // From: features/01-app-access.feature:15:5
  expect(await ctx.app.tokenInput.isSwitchNetworkButtonVisible()).toBe(true);
});

When('the user clicks the switch network button', async ({ ctx }) => {
  // Step: And the user clicks the switch network button
  // From: features/01-app-access.feature:21:5
  await ctx.app.tokenInput.changeNetwork();
});

When('the user confirms the switch network', async ({ ctx }) => {
  // Step: And the user confirms the switch network
  // From: features/01-app-access.feature:22:5
  const connect = await ctx.extension.getChangeNetworkScreen();
  await connect.continue();
  await ctx.extension.waitForNetwork('Sepolia');
});
