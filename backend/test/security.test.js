import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, createSessionToken, hashToken, isStrongPassword } from "../src/security.js";

test("passwords use a salted scrypt hash", async () => {
  const first = await hashPassword("ClaveSegura123");
  const second = await hashPassword("ClaveSegura123");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("ClaveSegura123", first), true);
  assert.equal(await verifyPassword("incorrecta", first), false);
});

test("password policy and session tokens", () => {
  assert.equal(isStrongPassword("ClaveSegura123"), true);
  assert.equal(isStrongPassword("corta"), false);
  const token = createSessionToken();
  assert.ok(token.length >= 40);
  assert.equal(hashToken(token), hashToken(token));
  assert.notEqual(hashToken(token), token);
});
