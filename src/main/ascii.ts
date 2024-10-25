/**
 * The plugin that enhances {@link index!StringShape StringShape} with the ASCII check.
 *
 * ```ts
 * import * as d from 'doubter/core';
 * import '@doubter/plugin-string-format/ascii';
 *
 * d.string().ascii();
 * ```
 *
 * @module ascii
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import { CODE_ASCII, MESSAGE_ASCII } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is an ASCII string.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link ascii! plugin-string-format/ascii}
     */
    ascii(options?: IssueOptions | Message): this;
  }
}

const pattern = /^[\x00-\x7F]+$/;

StringShape.prototype.ascii = function (issueOptions) {
  return this.addOperation(
    (value, param, options) => {
      if (pattern.test(value)) {
        return null;
      }
      return [createIssue(CODE_ASCII, value, MESSAGE_ASCII, param, options, issueOptions)];
    },
    { type: CODE_ASCII }
  );
};
