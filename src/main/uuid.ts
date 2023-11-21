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
 * @module plugin-string-format/uuid
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import { CODE_FORMAT } from './internal/constants';

export interface UUIDOptions extends IssueOptions {
  version?: 1 | 2 | 3 | 4 | 5 | 'any';
}

declare module 'doubter/core' {
  export interface Messages {
    'string.format.uuid': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is a UUID (Universally unique identifier).
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/uuid! plugin-string-format/uuid}
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
  ctor.messages['string.format.uuid'] = 'Must be a UUID';

  ctor.prototype.uuid = function (options) {
    const { version = 'any' } = extractOptions(options);

    const re = reMap[version];
    const param = { format: 'uuid', version };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.uuid'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (re !== undefined && re.test(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
