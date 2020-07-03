'use strict';
const assert = require('assert');
const finanzamt = require('.');

it('returns information about the Finanzamt Prenzlauer Berg', () => {
  assert.deepStrictEqual(finanzamt('1131'), {
    buFaNr: '1131',
    name: 'Prenzlauer Berg'
  });
});
