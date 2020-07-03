'use strict';
const finanzaemter = require('./data/finanzaemter.json');

module.exports = (bundesfinanzamtsnummer) => {
  if (typeof bundesfinanzamtsnummer !== 'string') {
    throw new TypeError('`bundesfinanzamtsnummer` must be a string');
  }

  return finanzaemter.find((finanzamt) => {
    return finanzamt.buFaNr === bundesfinanzamtsnummer;
  });
};
