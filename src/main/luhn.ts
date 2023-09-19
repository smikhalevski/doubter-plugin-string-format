/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableLuhnFormat from '@doubter/plugin-string-format/luhn';
 *
 * enableLuhnFormat(StringShape.prototype);
 * ```
 *
 * @module plugin-string-format/luhn
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isLuhnNumber from 'validator/lib/isLuhnNumber.js';
import { CODE_FORMAT, FORMAT_LUHN, MESSAGE_LUHN } from './internal/constants';

declare module 'doubter/core' {
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

export default function enableLuhnFormat(prototype: StringShape): void {
  prototype.luhn = function (options) {
    const param = { format: FORMAT_LUHN };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_LUHN, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isLuhnNumber(input)) {
          (issues ||= []).push(issueFactory(output, options));

          if (options.earlyReturn) {
            return issues;
          }
        }
        return next(input, output, options, issues);
      },
      { type: CODE_FORMAT, param }
    );
  };
}
