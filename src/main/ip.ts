/**
 * The plugin that enhances {@link index!StringShape StringShape} with the IP address check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableIPFormat from '@doubter/plugin-string-format/ip';
 *
 * enableIPFormat(StringShape);
 * ```
 *
 * @module ip
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
import isIP from 'validator/lib/isIP.js';
import { CODE_IP, MESSAGE_IP } from './constants';

export interface IPOptions extends IssueOptions {
  version?: 4 | 6;
}

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is an IP address.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link ip! ip}
     */
    ip(options?: IPOptions | Message): this;
  }
}

export default function enableIPFormat(ctor: typeof StringShape): void {
  ctor.prototype.ip = function (issueOptions) {
    const { version } = toIssueOptions(issueOptions);

    return this.addOperation(
      (value, param, options) => {
        if (isIP(value, param.version)) {
          return null;
        }
        return [createIssue(CODE_IP, value, MESSAGE_IP, param, options, issueOptions)];
      },
      { type: CODE_IP, param: { version } }
    );
  };
}
