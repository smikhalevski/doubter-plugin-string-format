/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the BIC (Bank Identification
 * Code) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableBICFormat from '@doubter/plugin-string-format/bic';
 *
 * enableBICFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/bic
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isBIC from 'validator/lib/isBIC.js';
import { CODE_FORMAT } from './internal/constants';

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be a BIC or SWIFT code"
     */
    'string.format.bic': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is a BIC (Bank Identification Code) or SWIFT code.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/bic! plugin-string-format/bic}
     */
    bic(options?: IssueOptions | Message): this;
  }
}

export default function enableBICFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.bic'] = 'Must be a BIC or SWIFT code';

  ctor.prototype.bic = function (options) {
    const param = { format: 'bic' };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.bic'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isBIC(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
