'use strict';
const fs = require('fs').promises;
const globby = require('globby');
const xml2js = require('xml2js');
const _ = require('lodash');
const writeJsonFile = require('write-json-file');

const getAddresse = (xmlAddresses, addressType) => {
  const xmlAddress = _.find(
    xmlAddresses,
    (address) => address.$['xsi:type'] === addressType
  );

  if (!xmlAddress) return undefined;

  const address = {
    type: addressType,
    strasse: xmlAddress.$.Strasse,
    hausNr: xmlAddress.$.HausNr,
    plz: xmlAddress.$.PLZ,
    ort: xmlAddress.$.Ort
  };

  return address;
};

const getAddresses = (xmlAddresses) => {
  const addressesTypes = ['HausanschriftType'];
  const adresses = _.map(addressesTypes, (addressType) =>
    getAddresse(xmlAddresses, addressType)
  );
  return _.every(adresses, _.isEmpty) ? undefined : adresses;
};

const getContactValue = (kontaktListe, attributeName) => {
  const contactNode = _.find(kontaktListe, ['$.Bezeichnung', attributeName]);
  return contactNode ? contactNode.$.Inhalt : undefined;
};

const readFile = async (path) => {
  const paths = await globby(path);

  if (paths.length === 0) {
    throw new Error(`'No file found'. file pattern: ${path}`);
  }

  const fileContent = await fs.readFile(paths[0]);
  return fileContent;
};

const getFinanzamt = (finanzamt) => {
  const attributes = finanzamt.$;
  const kontaktListe = finanzamt.KontaktListe[0].Kontakt;
  const adresseListe = finanzamt.AdresseListe[0].Adresse;

  const finanzamtJson = {
    buFaNr: attributes.BuFaNr,
    name: attributes.Name,
    tel: getContactValue(kontaktListe, 'Tel'),
    fax: getContactValue(kontaktListe, 'Fax'),
    mail: getContactValue(kontaktListe, 'Mail'),
    url: getContactValue(kontaktListe, 'URL'),
    addresses: getAddresses(adresseListe)
  };

  return finanzamtJson;
};

(async () => {
  const xmlFile = await readFile('data/GemFA_Export_*.xml');
  const input = await xml2js.parseStringPromise(xmlFile);
  const finanzamtListe = input.GemfaExport.FinanzamtListe[0].Finanzamt;
  const output = _.map(finanzamtListe, getFinanzamt);
  await writeJsonFile('data/finanzaemter.json', output);
})();
