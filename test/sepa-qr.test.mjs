import test from 'node:test';
import assert from 'node:assert/strict';

import { createSepaPayload, normalizeAmount } from '../src/lib/sepa-qr.js';

test('normalizeAmount formats valid values to EUR with 2 decimals', () => {
  assert.equal(normalizeAmount('12,5'), 'EUR12.50');
  assert.equal(normalizeAmount(' 7 '), 'EUR7.00');
});

test('normalizeAmount returns empty string for invalid or non-positive values', () => {
  assert.equal(normalizeAmount(''), '');
  assert.equal(normalizeAmount('abc'), '');
  assert.equal(normalizeAmount('-1'), '');
  assert.equal(normalizeAmount('0'), '');
});

test('createSepaPayload includes amount and reference in EPC fields', () => {
  const payload = createSepaPayload({
    iban: 'DE89 5001 0517 5421 8477 37',
    beneficiary: 'Jonas Holtkamp',
    serviceCode: 'INST',
    amountInput: '10.99',
    reference: 'Invoice 123',
  });

  const lines = payload.split('\n');
  assert.equal(lines[0], 'BCD');
  assert.equal(lines[3], 'INST');
  assert.equal(lines[6], 'DE89500105175421847737');
  assert.equal(lines[7], 'EUR10.99');
  assert.equal(lines[10], 'Invoice 123');
});
