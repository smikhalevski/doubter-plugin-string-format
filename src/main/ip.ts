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
 * @module plugin-string-format/ip
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import isIP from 'validator/lib/isIP.js';
import { CODE_FORMAT } from './constants';

export interface IPOptions extends IssueOptions {
  version?: 4 | 6 | 'any';
}

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be an IP address"
     */
    'string.format.ip': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is an IP address.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/ip! plugin-string-format/ip}
     */
    ip(options?: IPOptions | Message): this;
  }
}

export default function enableIPFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.ip'] = 'Must be an IP address';

  ctor.prototype.ip = function (options) {
    const { version = 'any' } = extractOptions(options);

    const param = { format: 'ip', version };
    const ipVersion = version === 'any' ? undefined : String(version);

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.ip'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isIP(value, ipVersion)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
