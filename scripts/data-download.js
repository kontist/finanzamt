'use strict';
const path = require('path');
const got = require('got');
const cheerio = require('cheerio');
const del = require('del');
const download = require('download');

const pageUrl =
  'https://www.bzst.de/DE/Service/Behoerdenwegweiser/Finanzamtsuche/finanzamtsuche_node.html';
const downloadDirectory = path.join(__dirname, '..', 'data');

(async () => {
  const response = await got(pageUrl);
  const $ = cheerio.load(response.body);
  const downloadLink = $('h3:contains("GemFA XML-Export Datei")')
    .closest('a')
    .prop('href');
  const downloadUrl = new URL(downloadLink, pageUrl);

  await del('data/GemFA_Export_*.xml');
  await download(downloadUrl, downloadDirectory, {extract: true});
})();
