'use strict';
const path = require('path');
const got = require('got');
const cheerio = require('cheerio');
const del = require('del');
const download = require('download');

const pageUrl =
  'https://www.govdata.de/daten/-/details/suche-nach-zustandigem-finanzamt';
const downloadDirectory = path.join(__dirname, '..', 'data');

const countriesStatesCitiesUrl =
  'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json';

(async () => {
  const response = await got(pageUrl);
  const $ = cheerio.load(response.body);
  const downloadLink = $('a:contains("gemfa_xml_export_datei")').prop('href');
  const downloadUrl = new URL(downloadLink, pageUrl);

  await del('data/gemfa_xml_export_datei.xml');
  await download(downloadUrl, downloadDirectory, {
    extract: true,
    filename: 'gemfa_xml_export_datei.xml',
  });

  await download(countriesStatesCitiesUrl, downloadDirectory, {
    extract: true,
    filename: 'countriesStatesCities.json',
  });
})();
