/**
 * The plugin that enhances {@link index!StringShape StringShape} with the BIC (Bank Identification
 * Code) check.
 *
 * ```ts
 * import * as d from 'doubter/core';
 * import '@doubter/plugin-string-format/bic';
 *
 * d.string().bic();
 * ```
 *
 * @module bic
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import isBIC from 'validator/lib/isBIC.js';
import { CODE_BIC, MESSAGE_BIC } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is a BIC (Bank Identification Code) or SWIFT code.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link bic! plugin-string-format/bic}
     */
    bic(options?: IssueOptions | Message): this;
  }
}

StringShape.prototype.bic = function (issueOptions) {
  return this.addOperation(
    (value, param, options) => {
      if (isBIC(value)) {
        return null;
      }
      return [createIssue(CODE_BIC, value, MESSAGE_BIC, param, options, issueOptions)];
    },
    { type: CODE_BIC }
  );
};
