'use strict';
const assert = require('assert');
const finanzamt = require('.');

it('returns information about the Finanzamt Prenzlauer Berg', () => {
  assert.deepStrictEqual(finanzamt('1131'), {
    buFaNr: '1131',
    name: 'Prenzlauer Berg'
  });
});

it('throws an error if bundesfinanzamtsnummer is not a string', () => {
  assert.throws(() => finanzamt(1131), {
    name: 'TypeError',
    message: '`bundesfinanzamtsnummer` must be a string'
  });
});
