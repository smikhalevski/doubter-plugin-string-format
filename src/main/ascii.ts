/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the ASCII check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableASCIIFormat from '@doubter/plugin-string-format/ascii';
 *
 * enableASCIIFormat(StringShape);
 * ```
 *
 * @module ascii
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import { CODE_FORMAT } from './constants';

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

const re = /^[\x00-\x7F]+$/;

export default function enableASCIIFormat(ctor: typeof StringShape): void {
  ctor.prototype.ascii = function (issueOptions) {
    return this.addOperation(
      (value, param, options) => {
        if (re.test(value)) {
          return null;
        }
        return [createIssue(CODE_FORMAT, value, 'Must be an ASCII string', param, options, issueOptions)];
      },
      { type: CODE_FORMAT, param: { format: 'ascii' } }
    );
  };
}
