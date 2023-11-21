import { StringShape } from 'doubter/core';
import enableBICFormat from './bic';
import enableEmailFormat from './email';
import enableFQDNFormat from './fqdn';
import enableIMEIFormat from './imei';
import enableISINFormat from './isin';
import enableLuhnFormat from './luhn';
import enableMIMEFormat from './mime';

export type * from './bic';
export type * from './email';
export type * from './fqdn';
export type * from './imei';
export type * from './isin';
export type * from './luhn';
export type * from './mime';

export default function enableStringFormat(ctor: typeof StringShape): void {
  enableBICFormat(ctor);
  enableEmailFormat(ctor);
  enableFQDNFormat(ctor);
  enableIMEIFormat(ctor);
  enableISINFormat(ctor);
  enableLuhnFormat(ctor);
  enableMIMEFormat(ctor);
}
