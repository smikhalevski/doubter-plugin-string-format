/**
 * The plugin that enhances {@link index!StringShape StringShape} with the
 * [MIME type](https://en.wikipedia.org/wiki/Media_type) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableMIMEFormat from '@doubter/plugin-string-format/mime';
 *
 * enableMIMEFormat(StringShape);
 * ```
 *
 * @module mime
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue } from 'doubter/utils';
import isMimeType from 'validator/lib/isMimeType.js';
import { CODE_MIME, MESSAGE_MIME } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format.
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link mime! plugin-string-format/mime}
     */
    mime(options?: IssueOptions | Message): this;
  }
}

export default function enableMIMEFormat(ctor: typeof StringShape): void {
  ctor.prototype.mime = function (issueOptions) {
    return this.addOperation(
      (value, param, options) => {
        if (isMimeType(value)) {
          return null;
        }
        return [createIssue(CODE_MIME, value, MESSAGE_MIME, param, options, issueOptions)];
      },
      { type: CODE_MIME }
    );
  };
}
