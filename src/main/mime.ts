/**
 * The plugin that enhances {@linkcode @doubter/plugin-string-format!StringShape} with the
 * [MIME type](https://en.wikipedia.org/wiki/Media_type) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableMIMEFormat from '@doubter/plugin-string-format/mime';
 *
 * enableMIMEFormat(StringShape.prototype);
 * ```
 *
 * @module @doubter/plugin-string-format/mime
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory } from 'doubter/utils';
import isMimeType from 'validator/lib/isMimeType';
import { CODE_FORMAT, FORMAT_MIME, MESSAGE_MIME } from './constants';

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link @doubter/plugin-string-format/mime!}
     */
    mime(options?: IssueOptions | Message): this;
  }
}

export default function (prototype: StringShape): void {
  prototype.mime = function (options) {
    const param = { format: FORMAT_MIME };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_MIME, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isMimeType(input)) {
          (issues ||= []).push(issueFactory(output, options));

          if (options.earlyReturn) {
            return issues;
          }
        }
        return next(input, output, options, issues);
      },
      { type: CODE_FORMAT, param }
    );
  };
}
