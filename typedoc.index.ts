/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with additional checks.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableStringFormat from '@doubter/plugin-string-format';
 *
 * enableStringFormat(StringShape);
 * ```
 *
 * @module plugin-string-format
 */

export * from './src/main';

import { StringShape } from 'doubter/core';

/**
 * This a slice from {@link doubter!StringShape doubter/core/StringShape} that contains only methods added by this
 * plugin.
 */
interface StringShape_
  extends Pick<StringShape, 'ascii' | 'bic' | 'email' | 'fqdn' | 'imei' | 'isin' | 'luhn' | 'mime' | 'uuid'> {}

export { StringShape_ as StringShape };
