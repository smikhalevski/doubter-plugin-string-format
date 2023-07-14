/**
 * The plugin that enhances {@linkcode @doubter/plugin-string-format!StringShape} with the
 * [IMEI number](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableIMEIFormat from '@doubter/plugin-string-format/imei';
 *
 * enableIMEIFormat(StringShape.prototype);
 * ```
 *
 * @module @doubter/plugin-string-format/imei
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import isIMEI from 'validator/lib/isIMEI';
import { CODE_FORMAT, FORMAT_IMEI, MESSAGE_IMEI } from './constants';

export interface IMEIOptions extends IssueOptions {
  /**
   * If `true` then IMEI with hyphens is considered valid.
   *
   * @default false
   */
  allowHyphens?: boolean;
}

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is a valid
     * [IMEI number](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity).
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link @doubter/plugin-string-format/imei!}
     */
    imei(options?: IMEIOptions | Message): this;
  }
}

export default function (prototype: StringShape): void {
  prototype.imei = function (options) {
    const { allowHyphens = false } = extractOptions(options);

    const param = { format: FORMAT_IMEI, allowHyphens };

    const imeiOptions = { allow_hyphens: allowHyphens };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_IMEI, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isIMEI(input, imeiOptions)) {
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
