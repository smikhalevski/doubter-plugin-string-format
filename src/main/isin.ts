/**
 * The plugin that enhances {@linkcode @doubter/plugin-string-format!StringShape} with the
 * [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) (stock/security identifier)
 * check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableISINFormat from '@doubter/plugin-string-format/isin';
 *
 * enableISINFormat(StringShape.prototype);
 * ```
 *
 * @module @doubter/plugin-string-format/isin
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isISIN from 'validator/lib/isISIN';
import { CODE_FORMAT, FORMAT_ISIN, MESSAGE_ISIN } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is an
     * [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number) (stock/security identifier).
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link @doubter/plugin-string-format/isin!}
     */
    isin(options?: IssueOptions | Message): this;
  }
}

export default function (prototype: StringShape): void {
  prototype.isin = function (options) {
    const param = { format: FORMAT_ISIN };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_ISIN, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isISIN(input)) {
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
