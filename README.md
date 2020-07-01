# finanzamt

> Get information about a German tax office (*Finanzamt*)

## Installation

```console
$ npm install finanzamt
```

## Usage

```js
const finanzamt = require('finanzamt');

finanzamt('1131');
// => { buFaNr: '1131', name: 'Prenzlauer Berg', … }
```

## API

### finanzamt(bundesfinanzamtsnummer)

Returns a [Finanzamt object](#finanzamt-1).

#### bundesfinanzamtsnummer

Type: `string`

German federal tax office number (*Bundesfinanzamtsnummer*).

### Finanzamt

Type: `object`

The property names and descriptions are based on the [GemFA XSD](https://www.bzst.de/SharedDocs/Downloads/DE/GemFA/gemfa_xsd_beschreibungsdatei2.xsd?__blob=publicationFile&v=4) by the [Federal Central Tax Office](https://www.bzst.de/EN/Home/home_node.html).

#### buFaNr

Type: `string`

Die Bundesfinanzamtsnummer.

#### name

Type: `string`

Der Name der Finanzbehörde.
