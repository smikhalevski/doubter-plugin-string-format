/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) (stock/security identifier)
 * check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableISINFormat from '@doubter/plugin-string-format/isin';
 *
 * enableISINFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/isin
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isISIN from 'validator/lib/isISIN.js';
import { CODE_FORMAT } from './internal/constants';

declare module 'doubter/core' {
  export interface Messages {
    'string.format.isin': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is an
     * [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) (stock/security identifier).
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/isin! plugin-string-format/isin}
     */
    isin(options?: IssueOptions | Message): this;
  }
}

export default function enableISINFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.isin'] = 'Must be an ISIN';

  ctor.prototype.isin = function (options) {
    const param = { format: 'isin' };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.isin'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isISIN(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
