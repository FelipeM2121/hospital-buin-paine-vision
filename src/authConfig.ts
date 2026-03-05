import type { Configuration, RedirectRequest } from '@azure/msal-browser';

const BASE_PATH = '/hospital-buin-paine-dashboard/';

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
};

export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};
