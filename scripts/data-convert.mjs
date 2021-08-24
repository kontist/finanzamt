'use strict';
import { promises as fs } from 'fs';
import { globby } from 'globby';
import { parseStringPromise } from 'xml2js';
import _ from 'lodash';
import { writeJsonFile } from 'write-json-file';

const normalizedCities = [
  { ort: 'Annaberg-B.', name: 'Annaberg-Buchholz' },
  { ort: 'Bad Homburg v. d. Höhe', name: 'Bad Homburg vor der Höhe' },
  { ort: 'Bad Neustadt', name: 'Bad Neustadt an der Saale' },
  { ort: 'Dessau-Roßlau', name: 'Dessau' },
  { ort: 'Eisleben', name: 'Eisleben Lutherstadt' },
  { ort: 'Elshorn', name: 'Elmshorn' },
  { ort: 'Frankfurt', name: 'Frankfurt am Main' },
  { ort: 'Haldensleben', name: 'Haldensleben I' },
  { ort: 'Hanau', name: 'Hanau am Main' },
  { ort: 'Hofheim', name: 'Hofheim in Unterfranken' },
  { ort: 'St. Ingbert', name: 'Sankt Ingbert' },
  { ort: 'Immenstadt', name: 'Immenstadt im Allgäu' },
  { ort: 'Kempten', name: 'Kempten (Allgäu)' },
  { ort: 'Landau', name: 'Landau an der Isar' },
  { ort: 'Limburg', name: 'Limburg an der Lahn' },
  { ort: 'Lohr', name: 'Lohr am Main' },
  { ort: 'Ludwigshafen', name: 'Ludwigshafen am Rhein' },
  { ort: 'Marburg', name: 'Marburg an der Lahn' },
  { ort: 'Meißen', name: 'Meißenheim' },
  { ort: 'München', name: 'Garching bei München' },
  { ort: 'Neumarkt', name: 'Neumarkt in der Oberpfalz' },
  { ort: 'Aschendorf', name: 'Markt Taschendorf' },
  { ort: 'Pfaffenhofen a. d. Ilm', name: 'Pfaffenhofen an der Ilm' },
  { ort: 'Schwandorf', name: 'Schwandorf in Bayern' },
  { ort: 'St. Wendel', name: 'Sankt Wendel' },
  { ort: 'Waren (Müritz)', name: 'Waren' },
];

const getContactValue = (kontaktListe, contactName) => {
  const contactNode = _.find(kontaktListe, ['$.Bezeichnung', contactName]);
  return contactNode ? contactNode.$.Inhalt : undefined;
};

const findStateByCity = (cityName, germanyStatesCities) =>
  _.find(germanyStatesCities.states, (s) =>
    _.some(s.cities, (c) => c.name.toLowerCase() === cityName.toLowerCase())
  );

const getState = (ort, germanyStatesCities) => {
  let state = findStateByCity(ort, germanyStatesCities);

  if (!state) {
    const normalizedCity = _.find(
      normalizedCities,
      (c) => c.ort.toLowerCase() === ort.toLowerCase()
    );

    if (normalizedCity) {
      state = findStateByCity(normalizedCity.name, germanyStatesCities);
    }
  }

  return state ? state.name : undefined;
};

const readFile = async (path) => {
  const paths = await globby(path);

  if (paths.length === 0) {
    throw new Error(`'No file found', file Path: ${path}`);
  }

  const fileContent = await fs.readFile(paths[0]);
  return fileContent;
};

const getFinanzamt = (finanzamt, germanyStatesCities) => {
  const attributes = finanzamt.$;
  const kontaktListe = finanzamt.KontaktListe[0].Kontakt;
  const address = _.find(
    finanzamt.AdresseListe[0].Adresse,
    (a) => a.$['xsi:type'] === 'HausanschriftType'
  );

  const url = getContactValue(kontaktListe, 'URL');

  let adresses = undefined;
  if (address) {
    adresses = [
      {
        type: 'HausanschriftType',
        strasse: address.$.Strasse,
        hausNr: address.$.HausNr,
        plz: address.$.PLZ,
        ort: address.$.Ort,
        state: getState(address.$.Ort, germanyStatesCities),
      },
    ];
  }
  return {
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
};

(async () => {
  const xmlFile = await readFile('data/gemfa_xml_export_datei.xml');
  const input = await parseStringPromise(xmlFile);
  const finanzamtListe = input.GemfaExport.FinanzamtListe[0].Finanzamt;
  const countriesStatesCitiesFile = await readFile(
    'data/countriesStatesCities.json'
  );

  const countriesStatesCities = JSON.parse(
    countriesStatesCitiesFile.toString()
  );

  const germanyStatesCities = _.find(
    countriesStatesCities,
    (c) => c.name === 'Germany'
  );

  const output = finanzamtListe
    .map((finanzamt) => getFinanzamt(finanzamt, germanyStatesCities))
    .sort((a1, a2) => a1.name.localeCompare(a2.name));

  await writeJsonFile('data/finanzaemter.json', output);
})();
