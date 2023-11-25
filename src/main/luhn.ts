/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableLuhnFormat from '@doubter/plugin-string-format/luhn';
 *
 * enableLuhnFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/luhn
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isLuhnNumber from 'validator/lib/isLuhnNumber.js';
import { CODE_FORMAT } from './constants';

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be a Luhn number"
     */
    'string.format.luhn': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string passes the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) check.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/luhn! plugin-string-format/luhn}
     */
    luhn(options?: IssueOptions | Message): this;
  }
}

export default function enableLuhnFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.luhn'] = 'Must be a Luhn number';

  ctor.prototype.luhn = function (options) {
    const param = { format: 'luhn' };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.luhn'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isLuhnNumber(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
