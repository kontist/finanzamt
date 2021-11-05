declare namespace finanzamt {
  interface Finanzamt {
    readonly buFaNr: string;
    readonly name: string;
    readonly hausanschrift?: Hausanschrift;
    readonly tel?: string;
    readonly fax?: string;
    readonly mail?: string;
    readonly url?: string;
  }

  interface Hausanschrift {
    readonly strasse: string;
    readonly hausNr?: string;
    readonly hausNrZusatz?: string;
    readonly plz: string;
    readonly ort: string;
  }
}

// See https://github.com/typescript-eslint/typescript-eslint/issues/1856.
// eslint-disable-next-line no-redeclare
declare const finanzamt: {
  /**
  Get information about a German tax office (*Finanzamt*).

  @param bundesfinanzamtsnummer - German federal tax office number (*Bundesfinanzamtsnummer*).
  @returns A Finanzamt object.

  @example
  ```
  import finanzamt = require('finanzamt');

  finanzamt('1131');
  ```
  */
  (bundesfinanzamtsnummer: string): finanzamt.Finanzamt;

  /**
  Get information about a German tax office (*Finanzamt*).

  @param steuernummer - German tax number (*Steuernummer*) in the national format.
  @returns A Finanzamt object.

  @example
  ```
  import finanzamt = require('finanzamt');

  finanzamt('1121081508150');
  ```
  */
  (steuernummer: string): finanzamt.Finanzamt;
};

export = finanzamt;
