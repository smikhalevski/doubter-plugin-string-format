/**
 * The plugin that enhances {@linkcode @doubter/plugin-string-format!StringShape} with additional checks.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableStringFormat from '@doubter/plugin-string-format';
 *
 * enableStringFormat(StringShape.prototype);
 * ```
 *
 * @module @doubter/plugin-string-format
 */

export * from './index';

import { StringShape } from 'doubter/core';

/**
 * This a slice from {@linkcode doubter!StringShape doubter/core/StringShape} that contains only methods added by this
 * plugin.
 */
interface StringShape_ extends Pick<StringShape, 'bic' | 'email' | 'fqdn' | 'imei' | 'isin' | 'luhn' | 'mime'> {}

export { StringShape_ as StringShape };
