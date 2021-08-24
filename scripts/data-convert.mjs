'use strict';
import {promises as fs} from 'node:fs';
import {globby} from 'globby';
import {parseStringPromise} from 'xml2js';
import _ from 'lodash';
import {writeJsonFile} from 'write-json-file';
import axios from 'axios';

const normalizeAddress = async (address) => {
  let response;
  let normalizedAddress;
  try {
    const url = 'https://geocoder.ls.hereapi.com/6.2/geocode.json';
    response = await axios.get(url, {
      params: {
        apiKey: 'oqpxylFhyB9lZ8G1nsurCxjgLesDlrXeDyntDe8ZYK0', // Replace with actual api key
        housenumber: address.hausNr,
        street: address.strasse,
        postalcode: address.plz,
        city: address.ort,
        country: 'germany',
      },
    });

    normalizedAddress = _.get(
      response,
      'data.Response.View[0].Result[0].Location.Address',
      {},
    );
  } catch (error) {
    console.log('error while getting state for', address);
    console.log('error:', error);
    console.log('response:', response);
  }

  return {
    ...address,
    strasse: normalizedAddress.Street || address.strasse,
    ort: normalizedAddress.City || address.ort,
    plz: normalizedAddress.PostalCode || address.plz,
    state: normalizedAddress.State,
  };
};

const getContactValue = (kontaktListe, contactName) => {
  const contactNode = _.find(kontaktListe, ['$.Bezeichnung', contactName]);
  return contactNode ? contactNode.$.Inhalt : undefined;
};

const readFile = async (path) => {
  const paths = await globby(path);

  if (paths.length === 0) {
    throw new Error(`'No file found', file Path: ${path}`);
  }

  const fileContent = await fs.readFile(paths[0]);
  return fileContent;
};

const getFinanzamt = async (finanzamt) => {
  const attributes = finanzamt.$;
  const kontaktListe = finanzamt.KontaktListe[0].Kontakt;
  const xmlAddress = _.find(
    finanzamt.AdresseListe[0].Adresse,
    (a) => a.$['xsi:type'] === 'HausanschriftType',
  );

  const url = getContactValue(kontaktListe, 'URL');

  let adresses;
  if (xmlAddress) {
    const address = {
      type: 'HausanschriftType',
      strasse: xmlAddress.$.Strasse,
      hausNr: xmlAddress.$.HausNr,
      plz: xmlAddress.$.PLZ,
      ort: xmlAddress.$.Ort,
      state: undefined,
    };

    const normalizedAddress = await normalizeAddress(address);
    adresses = [normalizedAddress];
  }

  const finanzamtJson = {
    buFaNr: attributes.BuFaNr,
    name: attributes.Name,
    kontakt: {
      tel: getContactValue(kontaktListe, 'Tel'),
      fax: getContactValue(kontaktListe, 'Fax'),
      email: getContactValue(kontaktListe, 'Mail'),
      url: url && `https://${url}`,
    },
    adresses,
  };

  return finanzamtJson;
};

(async () => {
  const xmlFile = await readFile('data/gemfa_xml_export_datei.xml');
  const input = await parseStringPromise(xmlFile);
  const finanzamtListe = input.GemfaExport.FinanzamtListe[0].Finanzamt;

  let output = await Promise.all(
    _.map(finanzamtListe, async (finanzamt) => getFinanzamt(finanzamt)),
  );

  output = output.sort((a1, a2) => a1.name.localeCompare(a2.name));

  await writeJsonFile('data/finanzaemter.json', output);
})();
