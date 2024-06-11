/**
 * The plugin that enhances {@link index!StringShape StringShape} with the UUID (Universally unique
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

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
import isUUID from 'validator/lib/isUUID.js';
import { CODE_UUID, MESSAGE_UUID } from './constants';

export interface UUIDOptions extends IssueOptions {
  version?: 1 | 2 | 3 | 4 | 5;
}

declare module 'doubter/core' {
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

export default function enableUUIDFormat(ctor: typeof StringShape): void {
  ctor.prototype.uuid = function (issueOptions) {
    const { version } = toIssueOptions(issueOptions);

    return this.addOperation(
      (value, param, options) => {
        if (isUUID(value, param.version)) {
          return null;
        }
        return [createIssue(CODE_UUID, value, MESSAGE_UUID, param, options, issueOptions)];
      },
      { type: CODE_UUID, param: { version } }
    );
  };
}
