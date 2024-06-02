/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [IMEI number](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableIMEIFormat from '@doubter/plugin-string-format/imei';
 *
 * enableIMEIFormat(StringShape);
 * ```
 *
 * @module imei
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
import isIMEI from 'validator/lib/isIMEI.js';
import { CODE_FORMAT } from './constants';

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
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link imei! plugin-string-format/imei}
     */
    imei(options?: IMEIOptions | Message): this;
  }
}

export default function enableIMEIFormat(ctor: typeof StringShape): void {
  ctor.prototype.imei = function (issueOptions) {
    const { allowHyphens = false } = toIssueOptions(issueOptions);

    const param = { format: 'imei', allowHyphens };

    const imeiOptions = { allow_hyphens: allowHyphens };

    return this.addOperation(
      (value, param, options) => {
        if (isIMEI(value, imeiOptions)) {
          return null;
        }
        return [createIssue(CODE_FORMAT, value, 'Must be an IMEI number', param, options, issueOptions)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
