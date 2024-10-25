/**
 * The plugin that enhances {@link index!StringShape StringShape} with additional checks.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import '@doubter/plugin-string-format';
 * ```
 *
 * @module index
 */

export * from './index';

import { StringShape } from 'doubter/core';

/**
 * This a slice from {@link doubter!StringShape doubter/core/StringShape} that contains only methods added by
 * this package.
 */
interface StringShape_
  extends Pick<StringShape, 'ascii' | 'bic' | 'email' | 'fqdn' | 'imei' | 'isin' | 'luhn' | 'mime' | 'uuid'> {}

export type { StringShape_ as StringShape };
