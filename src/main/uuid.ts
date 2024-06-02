/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the UUID (Universally unique
 * identifier) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableUUIDFormat from '@doubter/plugin-string-format/uuid';
 *
 * enableUUIDFormat(StringShape);
 * ```
 *
 * @module uuid
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
import { CODE_FORMAT } from './constants';

export interface UUIDOptions extends IssueOptions {
  version?: 1 | 2 | 3 | 4 | 5 | 'any';
}

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be a UUID"
     */
    'string.format.uuid': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is a UUID (Universally unique identifier).
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link uuid! plugin-string-format/uuid}
     */
    uuid(options?: UUIDOptions | Message): this;
  }
}

const reMap = {
  1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  any: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
};

export default function enableUUIDFormat(ctor: typeof StringShape): void {
  ctor.prototype.uuid = function (issueOptions) {
    const { version = 'any' } = toIssueOptions(issueOptions);

    const re = reMap[version];
    const param = { format: 'uuid', version };

    return this.addOperation(
      (value, param, options) => {
        if (re !== undefined && re.test(value)) {
          return null;
        }
        return [createIssue(CODE_FORMAT, value, 'Must be a UUID', param, options, issueOptions)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
