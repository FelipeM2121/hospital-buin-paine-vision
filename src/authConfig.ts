import type { Configuration, RedirectRequest } from '@azure/msal-browser';

const BASE_PATH = '/hospital-buin-paine-dashboard-sgd/';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin + BASE_PATH,
    postLogoutRedirectUri: window.location.origin + BASE_PATH,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    // Increase timeout for interactive requests (in milliseconds)
    // Default is 60000 (60 seconds), we increase to 120 seconds
    tokenRenewalOffsetSeconds: 120,
  },
};

export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

export const sharePointRequest: RedirectRequest = {
  scopes: ['Sites.Read.All'],
};
