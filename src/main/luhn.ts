/**
 * The plugin that enhances {@link index!StringShape StringShape} with the
 * [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableLuhnFormat from '@doubter/plugin-string-format/luhn';
 *
 * enableLuhnFormat(StringShape);
 * ```
 *
 * @module luhn
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import isLuhnNumber from 'validator/lib/isLuhnNumber.js';
import { CODE_LUHN, MESSAGE_LUHN } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string passes the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) check.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link luhn! plugin-string-format/luhn}
     */
    luhn(options?: IssueOptions | Message): this;
  }
}

export default function enableLuhnFormat(ctor: typeof StringShape): void {
  ctor.prototype.luhn = function (issueOptions) {
    return this.addOperation(
      (value, param, options) => {
        if (isLuhnNumber(value)) {
          return null;
        }
        return [createIssue(CODE_LUHN, value, MESSAGE_LUHN, param, options, issueOptions)];
      },
      { type: CODE_LUHN }
    );
  };
}
