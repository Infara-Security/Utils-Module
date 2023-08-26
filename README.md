# Utils-Module
Our utility module used in Infara

# Utility Functions

The following utility functions are available within the `window[launcher.config.name].utils` namespace:

## `patchFunction(obj, targetFunction, hookFunction)`

Patches a function with a hook function, allowing you to intercept and modify its behavior.

## `decodeJWT(token)`

Decodes and logs the content of a JSON Web Token (JWT).

## `interceptAuthorizationHeader()`

Intercepts and logs the `Authorization` header of XMLHttpRequests.

## `interceptHeader(headerToIntercept)`

Intercepts and logs a specified header of XMLHttpRequests.

## `getNonceFromCSP()`

Retrieves the nonce value from the Content Security Policy (CSP) header.

## `cookies`

A set of utility functions for handling cookies:

- `setCookie(name, value, days)`
- `getCookie(name)`
- `eraseCookie(name)`

## `url`

A set of utility functions for handling URLs and query parameters:

- `getQueryVariable(variable)`
- `getQueryVariableFromUrl(url, variable)`
- `getQueryParams(url)`

## `localStorage`

A set of utility functions for handling local storage:

- `setItem(key, value)`
- `getItem(key)`
- `removeItem(key)`
- `clear()`

## `sessionStorage`

A set of utility functions for handling session storage:

- `setItem(key, value)`
- `getItem(key)`
- `removeItem(key)`
- `clear()`
