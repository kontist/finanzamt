'use strict';
const finanzaemter = require('./data/finanzaemter.json');

module.exports = (bundesfinanzamtsnummer) => {
  if (typeof bundesfinanzamtsnummer !== 'string') {
    throw new TypeError('`bundesfinanzamtsnummer` must be a string');
  }

  if (bundesfinanzamtsnummer.length !== 4) {
    throw new TypeError('`bundesfinanzamtsnummer` must be 4 characters long');
  }

  return finanzaemter.find((finanzamt) => {
    return finanzamt.buFaNr === bundesfinanzamtsnummer;
  });
};
