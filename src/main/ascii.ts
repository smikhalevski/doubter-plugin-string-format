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
 * @module plugin-string-format/ascii
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import { CODE_FORMAT } from './internal/constants';

declare module 'doubter/core' {
  export interface Messages {
    'string.format.ascii': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is an ASCII string.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/ascii! plugin-string-format/ascii}
     */
    ascii(options?: IssueOptions | Message): this;
  }
}

const re = /^[\x00-\x7F]+$/;

export default function enableASCIIFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.ascii'] = 'Must be an ASCII string';

  ctor.prototype.ascii = function (options) {
    const param = { format: 'ascii' };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.ascii'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (re.test(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
