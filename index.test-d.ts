import {expectType, expectError} from 'tsd';
import {Finanzamt, Hausanschrift} from './index.js';
import finanzamt = require('.');

const taxOffice = finanzamt('1131');

expectType<Finanzamt>(taxOffice);

expectType<string>(taxOffice.buFaNr);
expectType<string>(taxOffice.name);

expectType<Hausanschrift | undefined>(taxOffice.hausanschrift);

if (taxOffice.hausanschrift) {
  expectType<string | undefined>(taxOffice.hausanschrift.hausNr);
  expectType<string | undefined>(taxOffice.hausanschrift.hausNrZusatz);
  expectType<string>(taxOffice.hausanschrift.plz);
  expectType<string>(taxOffice.hausanschrift.ort);
}

expectType<string | undefined>(taxOffice.tel);
expectType<string | undefined>(taxOffice.fax);
expectType<string | undefined>(taxOffice.mail);
expectType<string | undefined>(taxOffice.url);

expectError(finanzamt(42));
