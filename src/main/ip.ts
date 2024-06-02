/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the IP address check.
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
import { CODE_FORMAT } from './constants';

export interface IPOptions extends IssueOptions {
  version?: 4 | 6 | 'any';
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
    const { version = 'any' } = toIssueOptions(issueOptions);

    const param = { format: 'ip', version };
    const ipVersion = version === 'any' ? undefined : String(version);

    return this.addOperation(
      (value, param, options) => {
        if (isIP(value, ipVersion)) {
          return null;
        }
        return [createIssue(CODE_FORMAT, value, 'Must be an IP address', param, options, issueOptions)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
