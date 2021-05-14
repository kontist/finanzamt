'use strict';
const fs = require('fs').promises;
const globby = require('globby');
const xml2js = require('xml2js');
const _ = require('lodash');
const writeJsonFile = require('write-json-file');

(async () => {
  const xmlPaths = await globby('data/GemFA_Export_*.xml');

  if (xmlPaths.length === 0) {
    throw new Error('No XML file found');
  }

  const xmlPath = xmlPaths[0];
  const xmlFile = await fs.readFile(xmlPath);
  const input = await xml2js.parseStringPromise(xmlFile);

  const finanzamtListe = input.GemfaExport.FinanzamtListe[0].Finanzamt;

  const output = finanzamtListe.map((finanzamt) => {
    const attributes = finanzamt.$;
    const kontaktListe = finanzamt.KontaktListe[0].Kontakt;

    const url = _.find(kontaktListe, ['$.Bezeichnung', 'URL'])?.$.Inhalt;

    return {
      buFaNr: attributes.BuFaNr,
      name: attributes.Name,
      url
    };
  });

  await writeJsonFile('data/finanzaemter.json', output);
})();
