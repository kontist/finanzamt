'use strict';
const finanzaemter = require('./data/finanzaemter.json');
const downloadScript = require('./scripts/data-download');
const convertScript = require('./scripts/data-convert');

module.exports = (input) => {
  if (typeof input !== 'string') {
    throw new TypeError(
      '`bundesfinanzamtsnummer` or `steuernummer` must be a string'
    );
  }

  if (input.length !== 4 && input.length !== 13) {
    throw new TypeError(
      '`bundesfinanzamtsnummer` or `steuernummer` must be 4 or 13 characters long respectively'
    );
  }

  const bundesfinanzamtsnummer =
    input.length === 13 ? input.slice(0, 4) : input;

  return finanzaemter.find((finanzamt) => {
    return finanzamt.buFaNr === bundesfinanzamtsnummer;
  });
};

module.exports = getUpdatedFinanceOfficeData => {
    downloadScript();
    convertScript();
};
