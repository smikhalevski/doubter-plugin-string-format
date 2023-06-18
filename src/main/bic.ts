/**
 * The plugin that enhances {@linkcode @doubter/plugin-string-format!StringShape} with the BIC (Bank Identification Code) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableBICFormat from '@doubter/plugin-string-format/bic';
 *
 * enableBICFormat(StringShape.prototype);
 * ```
 *
 * @module @doubter/plugin-string-format/bic
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isBIC from 'validator/lib/isBIC';
import { CODE_FORMAT, FORMAT_BIC, MESSAGE_BIC } from './constants';
import { pushIssue } from './utils';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is a BIC (Bank Identification Code) or SWIFT code.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link @doubter/plugin-string-format/bic!}
     */
    bic(options?: IssueOptions | Message): this;
  }
}

export default function (prototype: StringShape): void {
  prototype.bic = function (options) {
    const param = { format: FORMAT_BIC };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_BIC, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isBIC(input)) {
          issues = pushIssue(issues, issueFactory(output, options));

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
