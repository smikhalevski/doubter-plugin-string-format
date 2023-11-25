/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [MIME type](https://en.wikipedia.org/wiki/Media_type) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableMIMEFormat from '@doubter/plugin-string-format/mime';
 *
 * enableMIMEFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/mime
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isMimeType from 'validator/lib/isMimeType.js';
import { CODE_FORMAT } from './constants';

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be a MIME type"
     */
    'string.format.mime': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/mime! plugin-string-format/mime}
     */
    mime(options?: IssueOptions | Message): this;
  }
}

export default function enableMIMEFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.mime'] = 'Must be a MIME type';

  ctor.prototype.mime = function (options) {
    const param = { format: 'mime' };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.mime'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isMimeType(value)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
