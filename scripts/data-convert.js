'use strict';
const fs = require('fs').promises;
const globby = require('globby');
const xml2js = require('xml2js');
const _ = require('lodash');
const writeJsonFile = require('write-json-file');

(async () => {
  const xmlPaths = await globby('data/GemFA_*.xml');

  if (xmlPaths.length === 0) {
    throw new Error('No XML file found');
  }

  const xmlPath = xmlPaths[0];
  const xmlFile = await fs.readFile(xmlPath);
  const input = await xml2js.parseStringPromise(xmlFile);

  const finanzamtListe = input.GemfaExport.FinanzamtListe[0].Finanzamt;

  const output = finanzamtListe.map((finanzamt) => {
    const attributes = finanzamt.$;

    const adresseListe = finanzamt.AdresseListe[0].Adresse;
    const hausanschrift = _.find(adresseListe, [
      '$.xsi:type',
      'HausanschriftType'
    ]);

    const strasse = hausanschrift?.$.Strasse;
    const hausNr = hausanschrift?.$.HausNr;
    const hausNrZusatz = hausanschrift?.$.HausNrZusatz;
    const plz = hausanschrift?.$.PLZ;
    const ort = hausanschrift?.$.Ort;

    const kontaktListe = finanzamt.KontaktListe[0].Kontakt;

    const tel = _.find(kontaktListe, ['$.Bezeichnung', 'Tel'])?.$.Inhalt;
    const fax = _.find(kontaktListe, ['$.Bezeichnung', 'Fax'])?.$.Inhalt;
    const mail = _.find(kontaktListe, ['$.Bezeichnung', 'Mail'])?.$.Inhalt;
    const url = _.find(kontaktListe, ['$.Bezeichnung', 'URL'])?.$.Inhalt;

    return {
      buFaNr: attributes.BuFaNr,
      name: attributes.Name,
      ...(hausanschrift && {
        hausanschrift: {
          strasse,
          hausNr,
          hausNrZusatz,
          plz,
          ort
        }
      }),
      tel,
      fax,
      mail,
      url
    };
  });

  await writeJsonFile('data/finanzaemter.json', output);
})();
