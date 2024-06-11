/**
 * The plugin that enhances {@link index!StringShape StringShape} with the
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
 * @module isin
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import isISIN from 'validator/lib/isISIN.js';
import { CODE_ISIN, MESSAGE_ISIN } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is an
     * [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) (stock/security identifier).
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link isin! plugin-string-format/isin}
     */
    isin(options?: IssueOptions | Message): this;
  }
}

export default function enableISINFormat(ctor: typeof StringShape): void {
  ctor.prototype.isin = function (issueOptions) {
    return this.addOperation(
      (value, param, options) => {
        if (isISIN(value)) {
          return null;
        }
        return [createIssue(CODE_ISIN, value, MESSAGE_ISIN, param, options, issueOptions)];
      },
      { type: CODE_ISIN }
    );
  };
}
