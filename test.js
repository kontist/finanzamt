const assert = require('assert');
const finanzamt = require('.');

it('returns information about the Finanzamt Prenzlauer Berg', () => {
  assert.deepStrictEqual(finanzamt('1131'), {
    buFaNr: '1131',
    name: 'Prenzlauer Berg',
    kontakt: {
      tel: '030 9024-28 0',
      fax: '030 9024-28 900',
      email: 'poststelle@fa-prenzlauer-berg.verwalt-berlin.de',
      url: 'https://http://www.berlin.de/sen/finanzen',
    },
    adresses: [
      {
        type: 'HausanschriftType',
        strasse: 'Storkower Straße',
        hausNr: '134',
        plz: '10407',
        ort: 'Berlin',
        state: 'Berlin',
      },
    ],
  });
});

it('returns information when steuernummer is given', () => {
  assert.strictEqual(finanzamt('1121081508150').name, 'Tempelhof');
});

it('returns no url property if there is none', () => {
  assert(!Object.prototype.hasOwnProperty.call(finanzamt('1055'), 'url'));
});

it('returns undefined if Finanzamt can’t be found', () => {
  assert.strictEqual(finanzamt('0000'), undefined);
});

it('throws an error if bundesfinanzamtsnummer is not 4 characters long', () => {
  assert.throws(() => finanzamt('1'), {
    name: 'TypeError',
    message:
      '`bundesfinanzamtsnummer` or `steuernummer` must be 4 or 13 characters long respectively',
  });
});

it('throws an error if steuernummer is not 13 characters long', () => {
  assert.throws(() => finanzamt('21/815/08150'), {
    name: 'TypeError',
    message:
      '`bundesfinanzamtsnummer` or `steuernummer` must be 4 or 13 characters long respectively',
  });
});

it('throws an error if input is not a string', () => {
  assert.throws(() => finanzamt(1131), {
    name: 'TypeError',
    message: '`bundesfinanzamtsnummer` or `steuernummer` must be a string',
  });
});
