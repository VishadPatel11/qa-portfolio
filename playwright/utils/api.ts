import { APIRequestContext, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
}

/** Unique per call so parallel tests never collide on the same account. */
export function newTestUser(): TestUser {
  const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return { email: `qa-${id}@test.local`, password: 'Str0ng!Passw0rd' };
}

/**
 * Create the user through the API instead of the UI.
 * Setup through the UI is slow and makes unrelated tests fail when the
 * registration page breaks. Only the registration test itself should use the UI.
 */
export async function registerUser(request: APIRequestContext, user: TestUser): Promise<void> {
  const res = await request.post('/api/Users', {
    data: {
      email: user.email,
      password: user.password,
      passwordRepeat: user.password,
      securityQuestion: { id: 1 },
      securityAnswer: 'test',
    },
  });
  expect(res.status(), `registering ${user.email}`).toBe(201);
}

export async function loginToken(request: APIRequestContext, user: TestUser): Promise<string> {
  const res = await request.post('/rest/user/login', {
    data: { email: user.email, password: user.password },
  });
  expect(res.ok(), `logging in ${user.email}`).toBeTruthy();
  const body = await res.json();
  return body.authentication.token as string;
}
