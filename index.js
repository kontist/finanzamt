'use strict';
const finanzaemter = require('./data/finanzaemter.json');

module.exports = (bundesfinanzamtsnummer) => {
  return finanzaemter.find((finanzamt) => {
    return finanzamt.buFaNr === bundesfinanzamtsnummer;
  });
};
