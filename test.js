'use strict';
const assert = require('assert');
const finanzamt = require('.');

it('returns information about the Finanzamt Prenzlauer Berg', () => {
  assert.deepStrictEqual(finanzamt('1131'), {
    buFaNr: '1131',
    name: 'Prenzlauer Berg'
  });
});

it('returns undefined if Finanzamt can’t be found', () => {
  assert.strictEqual(finanzamt('0000'), undefined);
});

it('throws an error if bundesfinanzamtsnummer is not 4 characters long', () => {
  assert.throws(() => finanzamt('1'), {
    name: 'TypeError',
    message: '`bundesfinanzamtsnummer` must be 4 characters long'
  });
});

it('throws an error if bundesfinanzamtsnummer is not a string', () => {
  assert.throws(() => finanzamt(1131), {
    name: 'TypeError',
    message: '`bundesfinanzamtsnummer` must be a string'
  });
});
