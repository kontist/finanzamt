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
### finanzamt(steuernummer)

Returns a [Finanzamt object](#finanzamt-1).

#### bundesfinanzamtsnummer

Type: `string`

German federal tax office number (*Bundesfinanzamtsnummer*).

#### steuernummer

Type: `string`

German tax number (*Steuernummer*) in the national format.

**Tip:** Use [normalize-steuernummer](https://github.com/kontist/normalize-steuernummer).

### Finanzamt

Type: `object`

The property names and descriptions are based on the [GemFA XSD](https://www.bzst.de/SharedDocs/Downloads/DE/GemFA/gemfa_xsd_beschreibungsdatei2.xsd?__blob=publicationFile&v=4) by the [Federal Central Tax Office](https://www.bzst.de/EN/Home/home_node.html).

#### buFaNr

Type: `string`

Die Bundesfinanzamtsnummer.

#### name

Type: `string`

Der Name der Finanzbehörde.

#### mail

Type: `string`

Die Mail-Kontaktangabe der Finanzbehörde.

*Nicht alle Finanzbehörden geben diesen Kontakt an.*

#### url

Type: `string`

Die URL-Kontaktangabe der Finanzbehörde.

*Nicht alle Finanzbehörden geben diesen Kontakt an.*

## License

This project is licensed under the MIT License. The underlying [GemFA](https://www.bzst.de/DE/Service/Behoerdenwegweiser/Finanzamtsuche/finanzamtsuche_node.html) data by the [Federal Central Tax Office](https://www.bzst.de/EN/Home/home_node.html) is in the public domain in accordance with [§ 5 Abs. 1 UrhG](https://www.gesetze-im-internet.de/urhg/__5.html).
